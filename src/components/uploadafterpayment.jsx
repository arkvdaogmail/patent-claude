import { useState } from 'react';

export default function UploadAfterPayment({ paymentIntentId, userId }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [txResult, setTxResult] = useState(null);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Uploading...');
    const formData = new FormData();
    formData.append('document', file);
    formData.append('paymentIntentId', paymentIntentId);
    if (userId) formData.append('userId', userId);

    const res = await fetch('/api/hash-and-chain', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      setTxResult(data);
      setStatus('Success!');
    } else {
      setStatus('Failed: ' + data.error);
    }
  };

  return (
    <div>
      <h3>Upload Document After Payment</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload & Hash</button>
      </form>
      {status && <div>{status}</div>}
      {txResult && (
        <div>
          <div><b>SHA-256:</b> {txResult.hash}</div>
          <div><b>Vechain TX:</b> {txResult.txid}</div>
          <a href={txResult.explorerUrl} target="_blank" rel="noopener noreferrer">
            View on Vechain Explorer
          </a>
        </div>
      )}
    </div>
  );
}
