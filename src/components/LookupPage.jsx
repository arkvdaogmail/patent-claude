import { useState } from 'react';

export default function LookupPage() {
  const [txId, setTxId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    if (!txId.trim()) {
      setError('Please enter a transaction ID');
      return;
    }

    setLoading(true);
    setError(null);
    setLookupResult(null);

    try {
      // First, try to fetch from our database
      const response = await fetch(`/api/lookup?txId=${encodeURIComponent(txId)}`);
      const data = await response.json();

      if (response.ok) {
        setLookupResult(data);
      } else {
        throw new Error(data.error || 'Document not found in our records');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div className="lookup-container">
      <div className="lookup-header">
        <h2>🔍 Document Lookup</h2>
        <p>Enter a transaction ID to verify document authenticity</p>
      </div>

      <div className="lookup-form">
        <div className="input-group">
          <input
            type="text"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter VeChain Transaction ID (0x...)"
            className="lookup-input"
          />
          <button 
            onClick={handleLookup}
            disabled={loading}
            className="lookup-button"
          >
            {loading ? 'Searching...' : 'Lookup'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>

      {lookupResult && (
        <div className="lookup-results">
          <div className="result-header">
            <h3>✅ Document Found</h3>
          </div>

          <div className="result-details">
            <div className="detail-row">
              <span className="label">Original Filename:</span>
              <span className="value">{lookupResult.original_filename}</span>
            </div>
            <div className="detail-row">
              <span className="label">File Hash:</span>
              <span className="value hash-display">{lookupResult.file_hash}</span>
            </div>
            <div className="detail-row">
              <span className="label">Transaction ID:</span>
              <span className="value hash-display">{lookupResult.tx_id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Notarized On:</span>
              <span className="value">
                {new Date(lookupResult.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="result-actions">
            <a 
              href={`https://explore.vechain.org/transactions/${lookupResult.tx_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="verify-button"
            >
              🔗 View on VeChain Explorer
            </a>
          </div>

          <div className="verification-info">
            <h4>How to Verify:</h4>
            <ol>
              <li>Click "View on VeChain Explorer" above</li>
              <li>Check that the transaction exists and is confirmed</li>
              <li>Compare the file hash with your document's SHA-256 hash</li>
              <li>Verify the timestamp matches your records</li>
            </ol>
          </div>
        </div>
      )}

      <div className="lookup-help">
        <h4>Need Help?</h4>
        <ul>
          <li>Transaction IDs start with "0x" followed by 64 characters</li>
          <li>You received this ID when you notarized your document</li>
          <li>Contact support if you can't find your transaction ID</li>
        </ul>
      </div>
    </div>
  );
}

