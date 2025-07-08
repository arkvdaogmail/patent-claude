import React, { useState } from 'react';
import { Hash, CheckCircle, Globe, Bot, Wallet, Copy, Download, Search, ChevronDown } from 'lucide-react';
import { sha256 } from 'js-sha256';

export default function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificate, setCertificate] = useState(null);

  // Wallet options
  const wallets = [
    { id: 'sync2', name: 'Sync2', icon: '🔄' },
    { id: 'veworld', name: 'VeWorld', icon: '🌍' }
  ];

  // Connect using Connex (Sync2/VeWorld)
  async function connectWithConnex(walletId) {
    if (!window.connex) {
      alert('Please install Sync2 or VeWorld extension and refresh this page.');
      return;
    }
    setIsProcessing(true);
    try {
      // Ask user to sign a message to get their address
      const res = await window.connex.vendor.sign('personalSign').request({
        signer: undefined,
        message: "Connect to PatentClaude dApp"
      });
      if (res && res.annex && res.annex.signer) {
        setWalletConnected(true);
        setConnectedWallet(walletId);
        setConnectedAddress(res.annex.signer);
      } else {
        throw new Error("Could not get wallet address");
      }
    } catch (err) {
      alert('Wallet connect failed: ' + err.message);
    }
    setIsProcessing(false);
  }

  async function handleWalletConnect(walletId) {
    await connectWithConnex(walletId);
  }

  async function sendProofToVeChain(hash) {
    if (!window.connex) {
      alert('Please install Sync2 or VeWorld extension!');
      return null;
    }
    const to = connectedAddress; // sending to self
    const value = '0';
    const data = '0x' + hash;
    const txSigningService = window.connex.vendor.sign('tx');
    txSigningService.addClause({ to, value, data });
    txSigningService.comment('PatentClaude Proof of idea');
    const output = await txSigningService.request();
    return output.txID;
  }

  const handleSubmitIdea = () => {
    if (!selectedCategory || !ideaDescription.trim()) {
      alert('Please select a category and describe your idea');
      return;
    }
    setCurrentSection('wallet');
  };

  const handleSecureProof = async () => {
    setIsProcessing(true);
    if (!walletConnected || !connectedAddress) {
      alert('Connect your wallet first!');
      setIsProcessing(false);
      return;
    }
    const hash = sha256(ideaDescription);
    try {
      const txId = await sendProofToVeChain(hash);
      if (txId) {
        setCertificate({
          vechainHash: txId,
          shaHash: hash,
          timestamp: new Date().toISOString(),
          address: connectedAddress,
          description: ideaDescription
        });
        setCurrentSection("certificate");
      }
    } catch (err) {
      alert("Error sending proof: " + err.message);
    }
    setIsProcessing(false);
  };

  return (
    <div style={{ backgroundColor: '#191919', minHeight: '100vh', fontFamily: 'Rubik' }}>
      {/* Navigation */}
      <nav style={{ padding: 24 }}>
        <button onClick={() => setCurrentSection('home')} style={{ marginRight: 12 }}>Home</button>
        <button onClick={() => setCurrentSection('submit')}>Protect Idea</button>
      </nav>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        {/* HOME SECTION */}
        {currentSection === 'home' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>
              Turn Your Ideas Into Unforgeable Proof
            </h1>
            <button
              onClick={() => setCurrentSection('submit')}
              style={{ background: '#2563eb', color: 'white', padding: '12px 32px', borderRadius: 24, fontSize: 18, marginTop: 24 }}
            >
              Start Protecting Your Idea
            </button>
          </div>
        )}

        {/* SECTION 1: SUBMIT IDEA */}
        {currentSection === 'submit' && (
          <div>
            <h2 style={{ color: 'white', fontSize: 24 }}>Protect Your Innovation</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', margin: '24px 0', padding: 8, borderRadius: 16 }}
            >
              <option value="">Select innovation type...</option>
              <option value="software">App/Software Concept</option>
              <option value="business">Business Process</option>
              <option value="product">Product Design</option>
              <option value="creative">Creative Work</option>
              <option value="process">Process Improvement</option>
            </select>
            <textarea
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Describe your idea in detail..."
              style={{ width: '100%', height: 100, borderRadius: 16, padding: 8 }}
            />
            <button
              onClick={handleSubmitIdea}
              style={{ background: '#2563eb', color: 'white', padding: '12px 32px', borderRadius: 24, fontSize: 18, marginTop: 24 }}
            >
              Next: Connect Wallet
            </button>
          </div>
        )}

        {/* SECTION 2: WALLET CONNECTION */}
        {currentSection === 'wallet' && (
          <div>
            <h2 style={{ color: 'white', fontSize: 24 }}>Connect Your Wallet</h2>
            {!walletConnected ? (
              <div>
                <p style={{ color: 'white' }}>Choose your wallet:</p>
                <div style={{ display: 'flex', gap: 24, margin: '24px 0' }}>
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={isProcessing}
                      style={{
                        background: '#333',
                        color: 'white',
                        borderRadius: 16,
                        padding: 16,
                        fontSize: 18,
                        opacity: isProcessing ? 0.6 : 1
                      }}
                    >
                      {wallet.icon} {wallet.name}
                    </button>
                  ))}
                </div>
                {isProcessing && <p style={{ color: '#60a5fa' }}>Connecting wallet...</p>}
              </div>
            ) : (
              <div>
                <p style={{ color: '#4ade80' }}>Wallet connected: {connectedWallet}</p>
                <p style={{ color: 'white' }}>Address: {connectedAddress}</p>
                <button
                  onClick={handleSecureProof}
                  disabled={isProcessing}
                  style={{
                    background: '#059669',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: 24,
                    fontSize: 18,
                    marginTop: 24,
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  {isProcessing ? 'Securing blockchain proof...' : 'Secure My Proof (Testnet)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: CERTIFICATE DISPLAY */}
        {currentSection === 'certificate' && certificate && (
          <div>
            <h2 style={{ color: '#4ade80', fontSize: 24 }}>Your Idea is Protected!</h2>
            <p style={{ color: 'white', marginTop: 12 }}>
              <b>Address:</b> {certificate.address}
            </p>
            <p style={{ color: 'white', marginTop: 12 }}>
              <b>SHA256 Hash:</b> {certificate.shaHash}
            </p>
            <p style={{ color: 'white', marginTop: 12 }}>
              <b>VeChain Tx Hash:</b> {certificate.vechainHash}
            </p>
            <p style={{ color: 'white', marginTop: 12 }}>
              <b>Description:</b> {certificate.description}
            </p>
            <p style={{ color: 'white', marginTop: 12 }}>
              <b>Date:</b> {new Date(certificate.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
