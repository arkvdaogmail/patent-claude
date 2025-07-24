import { useState } from 'react';

export default function CertificatePage({ result, fileName }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) {
    return (
      <div className="certificate-container">
        <h2>Certificate Not Available</h2>
        <p>No notarization result found.</p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="certificate-container">
      <div className="certificate-header">
        <h1>🏛️ Document Notarization Certificate</h1>
        <div className="certificate-seal">OFFICIAL</div>
      </div>

      <div className="certificate-body">
        <div className="certificate-info">
          <h3>Certificate of Authenticity</h3>
          <p className="certificate-text">
            This certifies that the document <strong>"{fileName}"</strong> has been 
            officially notarized and recorded on the VeChain blockchain.
          </p>
        </div>

        <div className="certificate-details">
          <div className="detail-row">
            <span className="label">Document:</span>
            <span className="value">{fileName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Transaction ID:</span>
            <span className="value hash-display">{result.txId}</span>
          </div>
          <div className="detail-row">
            <span className="label">File Hash:</span>
            <span className="value hash-display">{result.fileHash}</span>
          </div>
          <div className="detail-row">
            <span className="label">Notarized On:</span>
            <span className="value">{currentDate} at {currentTime}</span>
          </div>
          <div className="detail-row">
            <span className="label">Blockchain:</span>
            <span className="value">VeChain Testnet</span>
          </div>
        </div>

        <div className="certificate-actions">
          <a 
            href={`https://explore.vechain.org/transactions/${result.txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="verify-button"
          >
            🔍 Verify on Blockchain
          </a>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="details-button"
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </button>
        </div>

        {showDetails && (
          <div className="technical-details">
            <h4>Technical Information</h4>
            <div className="tech-info">
              <p><strong>Blockchain Network:</strong> VeChain Thor Testnet</p>
              <p><strong>Hash Algorithm:</strong> SHA-256</p>
              <p><strong>Transaction Status:</strong> Confirmed</p>
              <p><strong>Smart Contract:</strong> Document Notarization Service</p>
            </div>
          </div>
        )}
      </div>

      <div className="certificate-footer">
        <p className="disclaimer">
          This certificate serves as proof that your document has been timestamped 
          and recorded on the blockchain. The original document remains unchanged.
        </p>
      </div>
    </div>
  );
}

