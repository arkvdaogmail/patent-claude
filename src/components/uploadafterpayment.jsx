import { useState } from 'react';

export default function UploadAfterPayment({ paymentIntentId, userId }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('Uploading...');
    setResult(null);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('paymentIntentId', paymentIntentId);
    if (userId) formData.append('userId', userId);

    // --- THIS IS THE CORRECTED LINE ---
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    
    const data = await res.json();
    if (res.ok) {
      setResult(data);
      setStatus('Success!');
    } else {
      setStatus(`Failed: ${data.error}`);
    }
  };

  return (
    <div>
      <h3>Upload Document After Payment</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
        <button type="submit" disabled={!file || status === 'Uploading...'}>Upload & Hash</button>
      </form>
      {status && <div>Status: {status}</div>}
      {result && (
        <div>
          <p>Vechain TxId: {result.txId}</p>
          <a href={`https://explore.vechain.org/transactions/${result.txId}`} target="_blank" rel="noopener noreferrer">
            View on Vechain Explorer
          </a>
        </div>
       )}
    </div>
  );
}

