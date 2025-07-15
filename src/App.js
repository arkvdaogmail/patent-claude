import React, { useState } from "react";
import { useConnex, useWallet, WalletProvider } from "@vechain/vechain-kit-react";
import { sha256 } from "js-sha256"; // Ensure this is installed: npm install js-sha256
import {
  Hash,
  CheckCircle,
  Globe,
  Bot,
  Wallet,
  Copy,
  Download,
  Search,
  ChevronDown
} from "lucide-react";

const categories = [
  { value: "software", label: "App/Software Concept" },
  { value: "business", label: "Business Process" },
  { value: "product", label: "Product Design" },
  { value: "creative", label: "Creative Work" },
  { value: "process", label: "Process Improvement" }
];

const typography = {
  headline: "text-[32px] leading-[1.25] font-medium",
  title: "text-[20px] leading-[1.2] font-medium",
  body: "text-[16px] leading-[1.5]",
  baseM: "text-[16px] leading-[1.5] font-medium",
  base2: "text-[14px] leading-[1.43]",
  base2M: "text-[14px] leading-[1.43] font-semibold",
  caption: "text-[12px] leading-[1.33]",
  captionM: "text-[12px] leading-[1.33] font-semibold"
};

function PatentClaudeApp() {
  // UI & state
  const [currentSection, setCurrentSection] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  // NEW STATE VARIABLES FOR FILE UPLOAD AND HASH
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileHash, setFileHash] = useState(""); // This will store the hash of the uploaded file
  // END NEW STATE VARIABLES
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [showLanguages, setShowLanguages] = useState(false);

  // Wallet/Connex
  const connex = useConnex();
  const { wallet, isConnecting, connect, disconnect } = useWallet();

  // Step 1: Can proceed after idea & category + (file OR description)
  // MODIFIED canProceedToWallet
  const canProceedToWallet = selectedCategory && (uploadedFile || ideaDescription.trim());
  // END MODIFIED

  // Function to handle file upload and hash generation
  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true); // Indicate processing for hashing
      // setStatus("Generating file hash..."); // Uncomment if you have a general status display

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const fileUint8Array = new Uint8Array(arrayBuffer);
          const fileContentString = String.fromCharCode.apply(null, fileUint8Array); 

          const hash = sha256(fileContentString);
          setFileHash(hash);
          // setStatus("File hash generated."); // Update status
          setIsProcessing(false);
        };
        reader.onerror = (e) => {
          console.error("FileReader error:", e);
          // setStatus("Error reading file."); // Update status
          setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file); // Read file as ArrayBuffer for binary hashing
      } catch (err) {
        alert("Error processing file: " + (err?.message || err));
        // setStatus("Error processing file."); // Update status
        setIsProcessing(false);
      }
    } else {
      setUploadedFile(null);
      setFileHash("");
      // setStatus(""); // Clear status
    }
  }


  // Step 2: Connect wallet
  async function handleWalletConnect() {
    try {
      await connect();
    } catch (err) {
      alert("Wallet connect failed: " + (err?.message || err));
    }
  }

  // Step 3: Pay & Protect
  async function handlePayAndProtect() {
    if (!wallet || !wallet.address) {
      alert("Connect your wallet first!");
      return;
    }
    setIsProcessing(true);

    try {
      // Double hash - use fileHash if available, otherwise fallback to ideaDescription
      // MODIFIED HASH LOGIC
      const contentToHash = fileHash || ideaDescription;
      if (!contentToHash) {
        alert("No file uploaded or description provided!");
        setIsProcessing(false);
        return;
      }
      const firstHash = sha256(contentToHash);
      const doubleHash = sha256(firstHash + wallet.address);
      // END MODIFIED HASH LOGIC

      // Send transaction (data is 0x + doubleHash)
      const to = wallet.address;
      const value = "0"; // This should be 0 if the backend relayer pays gas
      const data = "0x" + doubleHash;

      const txSigningService = connex.vendor.sign("tx");
      txSigningService.addClause({ to, value, data });
      txSigningService.comment("PatentClaude Proof of idea");

      const output = await txSigningService.request();
      if (output && output.txID) {
        // Here you would also call your new /api/storeProof.js to save to Supabase
        const storeProofResponse = await fetch('/api/storeProof', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vechainHash: output.txID,
            shaHash: doubleHash,
            timestamp: new Date().toISOString(),
            address: wallet.address,
            description: uploadedFile ? `File: ${uploadedFile.name}` : ideaDescription, // Store file name or description
            category: selectedCategory
          })
        });

        const storeProofResult = await storeProofResponse.json();
        if (!storeProofResponse.ok) {
          console.error('Failed to store proof in Supabase:', storeProofResult.details);
          alert('Proof recorded on blockchain, but failed to save to your certificates: ' + (storeProofResult.details || 'Unknown error.'));
          // You might still show the certificate if blockchain part succeeded
        } else {
          console.log('Proof stored in Supabase:', storeProofResult);
        }

        setCertificate({
          vechainHash: output.txID,
          shaHash: doubleHash,
          timestamp: new Date().toISOString(),
          address: wallet.address,
          description: uploadedFile ? `File: ${uploadedFile.name}` : ideaDescription, // Use file name or description
          category: selectedCategory
        });
        setCurrentSection("certificate");
      } else {
        alert("Blockchain transaction failed.");
      }
    } catch (err) {
      alert("Error sending proof: " + (err?.message || err));
    }
    setIsProcessing(false);
  }

  // Reset all state for new flow
  function startNewProtectionProcess() {
    setCertificate(null);
    setIdeaDescription("");
    setUploadedFile(null); // Clear uploaded file
    setFileHash(""); // Clear file hash
    setSelectedCategory("");
    setCurrentSection("submit");
  }

  // Download certificate
  function handleDownload() {
    if (!certificate) return;
    const blob = new Blob(
      [
        `PatentClaude Blockchain Proof Certificate\n\nCategory: ${
          categories.find(c => c.value === certificate.category)?.label
        }\nDescription: ${certificate.description}\nWallet Address: ${
          certificate.address
        }\nSHA-256 Double Hash: ${certificate.shaHash}\nVeChain Tx Hash: ${
          certificate.vechainHash
        }\nTimestamp: ${certificate.timestamp}`
      ],
      { type: "text/plain" }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PatentClaude-Proof-Certificate.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Function to fetch certificates for 'My Certificates' section
  const fetchMyCertificates = async () => {
    if (!wallet || !wallet.address) {
      alert("Connect wallet to view certificates!");
      return [];
    }
    try {
      const response = await fetch(`/api/getProofs?walletAddress=${wallet.address}`);
      const result = await response.json();
      if (response.ok) {
        // Update state to show these certificates (you'll need to define a state for this, e.g., 'myCertificates')
        // For now, let's just log and update the 'certificate' state for demonstration
        console.log("My Certificates:", result.data);
        // setMyCertificates(result.data); // You'd typically set a list of certificates here
        return result.data;
      } else {
        alert("Failed to fetch certificates: " + (result.details || "Unknown error"));
        return [];
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      alert("Error fetching certificates.");
      return [];
    }
  };

  // Function for 'Verify Proof'
  const handleVerifyProof = async (contentToVerify, txIdToVerify) => {
    // Re-hash content provided by user for verification
    const rehashedContent = sha256(contentToVerify);
    // Call getProofs API to check if this hash/txId exists
    try {
        const response = await fetch(`/api/getProofs?shaHash=${rehashedContent}&vechainTxid=${txIdToVerify}`);
        const result = await response.json();
        if (response.ok && result.data && result.data.length > 0) {
            alert("Proof Verified! Matches existing record.");
            console.log("Verified Proof:", result.data[0]);
            // Display proof details on UI
        } else {
            alert("Proof Not Found or does not match.");
        }
    } catch (error) {
        console.error("Verification error:", error);
        alert("Error during verification.");
    }
  };


  return (
    <div className="min-h-screen font-['Rubik']" style={{ backgroundColor: "#191919" }}>
      {/* Language Dropdown */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className={`flex items-center gap-2 bg-black/20 backdrop-blur-lg border border-white/10 rounded-[32px] px-4 py-3 text-white hover:bg-white/10 transition-all ${typography.base2}`}
          >
            <Globe className="w-4 h-4" />
            <span>English</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showLanguages ? "rotate-180" : ""}`} />
          </button>
          {showLanguages && (
            <div className="absolute top-full right-0 mt-2 bg-black/40 backdrop-blur-lg border border-white/10 rounded-[32px] overflow-hidden">
              <div className="py-2">
                <div className={`px-4 py-2 text-white hover:bg-white/10 cursor-pointer ${typography.base2}`}>English</div>
                <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Spanish (Coming Soon)</div>
                <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Chinese (Coming Soon)</div>
                <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Japanese (Coming Soon)</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Navigation */}
      <nav className="relative z-40 p-6">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex bg-black/20 rounded-[32px] p-1 backdrop-blur-lg border border-white/10">
            <button
              onClick={() => setCurrentSection("home")}
              className={`px-6 py-3 rounded-[32px] transition-all ${typography.baseM} ${
                currentSection === "home" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </button>
            <button
              onClick={startNewProtectionProcess}
              className={`px-6 py-3 rounded-[32px] transition-all ${typography.baseM} ${
                currentSection === "submit" ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Protect Idea
            </button>
            <button
              onClick={() => { setCurrentSection("certificates"); fetchMyCertificates(); }} // Fetch on click
              className={`px-6 py-3 rounded-[32px] transition-all ${typography.baseM} ${
                currentSection === "certificates" ? "bg-green-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              My Certificates
            </button>
            <button
              onClick={() => setCurrentSection("verify")}
              className={`px-6 py-3 rounded-[32px] transition-all ${typography.baseM} ${
                currentSection === "verify" ? "bg-purple-500 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Verify Proof
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* HOME SECTION */}
        {currentSection === "home" && (
          <div className="text-center">
            <div className="mb-12">
              <h1 className={`${typography.headline} text-white mb-6`} style={{ fontSize: "48px" }}>
                Turn Your Ideas Into Unforgeable Proof
              </h1>
              <p className={`${typography.title} text-gray-300 mb-8`}>
                Blockchain-certified timestamps accepted globally. Court-admissible proof of creation in minutes, not years.
              </p>
              <button
                onClick={startNewProtectionProcess}
                className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white ${typography.baseM} py-4 px-8 rounded-[32px] hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                Start Protecting Your Idea
              </button>
            </div>
            {/* Value Props and Differences... */}
          </div>
        )}

        {/* SUBMIT IDEA SECTION */}
        {currentSection === "submit" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
              <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
                <Hash className="w-6 h-6 text-blue-400" />
                Protect Your Innovation
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={`block text-gray-300 ${typography.baseM} mb-2`}>Innovation Category</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={`w-full bg-white/5 border border-white/10 rounded-[32px] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${typography.body}`}
                  >
                    <option value="">Select your innovation type...</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-[#303030]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* REPLACED TEXTAREA WITH FILE INPUT */}
                <div>
                  <label className={`block text-gray-300 ${typography.baseM} mb-2`}>Upload File for Notarization</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={`w-full bg-white/5 border border-white/10 rounded-[32px] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${typography.body}`}
                  />
                  {uploadedFile && (
                    <p className={`${typography.caption} text-gray-400 mt-2`}>
                      File: {uploadedFile.name} | Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                  {fileHash && (
                    <div className="mt-2 p-3 bg-white/10 border border-white/20 rounded-[16px] break-words">
                      <p className={`text-green-300 ${typography.base2M}`}>Instant SHA-256 Hash:</p>
                      <p className={`text-white font-mono ${typography.base2}`}>{fileHash}</p>
                    </div>
                  )}
                  <p className={`${typography.caption} text-gray-400 mt-2`}>
                    We create cryptographic proof of creation date by hashing your file content. Your file is **not uploaded**, only its cryptographic hash is used.
                  </p>
                </div>
                {/* END REPLACED */}
                {/* Wallet Connect Section */}
                <div className="mt-8">
                  <div className="mb-4">
                    <h3 className={`text-white ${typography.title} mb-2 flex items-center gap-2`}>
                      <Wallet className="w-5 h-5 text-green-400" />
                      Connect Your Wallet
                    </h3>
                    {!wallet ? (
                      <button
                        onClick={handleWalletConnect}
                        disabled={!canProceedToWallet || isConnecting || isProcessing}
                        className={`flex items-center gap-2 bg-white/5 border border-white/10 rounded-[32px] px-6 py-3 text-white hover:bg-white/10 transition-all disabled:opacity-50 ${typography.baseM}`}
                      >
                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        Wallet Connected: {wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}
                        <button className="text-gray-300 underline ml-2" onClick={disconnect}>Disconnect</button>
                      </div>
                    )}
                  </div>
                  {/* Pay & Protect Button */}
                  <button
                    onClick={handlePayAndProtect}
                    disabled={!canProceedToWallet || !wallet || isProcessing}
                    className={`mt-6 w-full bg-gradient-to-r from-green-500 to-teal-600 text-white ${typography.baseM} py-4 px-6 rounded-[32px] hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50`}
                  >
                    {isProcessing && wallet
                      ? "🔄 Processing on Blockchain..."
                      : "Pay & Protect My Idea ($15)"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CERTIFICATE DISPLAY */}
        {currentSection === "certificate" && certificate && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
              <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
                <CheckCircle className="w-6 h-6 text-green-400" />
                Your Idea is Protected!
              </h2>
              <div className="bg-green-500/10 border border-green-500/30 rounded-[32px] p-6 mb-6">
                <p className={`text-green-300 ${typography.body} mb-4`}>
                  Congratulations! Your innovation has been timestamped on the blockchain with unforgeable proof.
                </p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-gray-300 ${typography.baseM}`}>VeChain Hash ID:</span>
                    <button onClick={() => navigator.clipboard.writeText(certificate.vechainHash)} className="text-blue-400 hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-white font-mono ${typography.base2} mt-1`}>{certificate.vechainHash}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-gray-300 ${typography.baseM}`}>SHA-Hash ID:</span>
                    <button onClick={() => navigator.clipboard.writeText(certificate.shaHash)} className="text-blue-400 hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-white font-mono ${typography.base2} mt-1`}>{certificate.shaHash}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                  <span className={`text-gray-300 ${typography.baseM}`}>Timestamp:</span>
                  <p className={`text-white ${typography.base2} mt-1`}>{new Date(certificate.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                  <span className={`text-gray-300 ${typography.baseM}`}>Wallet Address:</span>
                  <p className={`text-white font-mono ${typography.base2} mt-1`}>{certificate.address}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
                  <span className={`text-gray-300 ${typography.baseM}`}>Description:</span>
                  <p className={`text-white ${typography.base2} mt-1`}>{certificate.description}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  className={`flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-[32px] hover:bg-blue-600 transition-all ${typography.baseM}`}
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
                <button
                  onClick={() => setCurrentSection("certificates")}
                  className={`bg-white/10 text-white px-6 py-3 rounded-[32px] hover:bg-white/20 transition-all ${typography.baseM}`}
                >
                  View My Certificates
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MY CERTIFICATES & VERIFY PROOF */}
        {(currentSection === "certificates" || currentSection === "verify") && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
              <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
                <Search className="w-6 h-6 text-purple-400" />
                {currentSection === "certificates" ? "My
