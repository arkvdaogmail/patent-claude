import { useState } from 'react';

export default function UploadAfterPayment({ paymentIntentId, userId }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setStatus(null); // Reset status when a new file is chosen
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file first.');
      return;
    }

    setStatus('Uploading and processing...');
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('paymentIntentId', paymentIntentId);
    if (userId) {
      formData.append('userId', userId);
    }

    try {
      // --- THIS IS THE CORRECTED API PATH ---
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the server (like a failed transaction)
        throw new Error(data.error || 'An unknown error occurred.');
      }

      setResult(data);
      setStatus('Success! Your document has been notarized.');

    } catch (err) {
      // Handle network errors or exceptions
      setStatus('Failed');
      setError(err.message);
    }
  };

  return (
    <div className="upload-area">
      <h3>Notarize and Publish Document</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!file || status === 'Uploading and processing...'}>
          Notarize and Publish
        </button>
      </form>

      {status && <p className="status-message">Status: {status}</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {result && (
        <div className="result-summary">
          <h4>Notarization Complete!</h4>
          <p>
            <strong>Document Hash:</strong> {result.fileHash}
          </p>
          <p>
            <strong>Vechain Transaction ID:</strong> {result.txId}
          </p>
          <a
            href={`https://explore.vechain.org/transactions/${result.txId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Vechain Explorer
          </a>
        </div>
       )}
    </div>
  );
}
