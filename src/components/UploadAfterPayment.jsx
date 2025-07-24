import { useState } from 'react';

export default function UploadAfterPayment({ fileToUpload, paymentIntentId, userId, onSuccess }) {
  const [status, setStatus] = useState('Ready to publish...');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePublish = async () => {
    if (!fileToUpload) {
      setError('No file was provided to notarize.');
      return;
    }

    setStatus('Processing and publishing to blockchain...');
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('document', fileToUpload);
    formData.append('paymentIntentId', paymentIntentId);
    if (userId) {
      formData.append('userId', userId);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown server error occurred.');
      }
      setResult(data);
      setStatus('Success! Your document has been notarized.');
      
      // Call the success callback to navigate to certificate page
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setStatus('Failed');
      setError(err.message);
    }
  };

  return (
    <div className="upload-area">
      <button onClick={handlePublish} disabled={status.includes('Processing')}>
        Notarize and Publish
      </button>
      {status && <p className="status-message">Status: {status}</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {result && (
        <div className="result-summary">
          <h4>Notarization Complete!</h4>
          <p><strong>Vechain Transaction ID:</strong> {result.txId}</p>
          <a href={`https://explore.vechain.org/transactions/${result.txId}`} target="_blank" rel="noopener noreferrer">
            View on Vechain Explorer
          </a>
        </div>
       )}
    </div>
  );
}
