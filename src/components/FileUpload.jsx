import { useState } from 'react';

const ACCEPTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx', '.json', '.csv'
];

function isAccepted(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext);
}

export default function FileUpload({ onFileUpload }) {
  const [pickedFiles, setPickedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handlePick = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter(isAccepted);
    const invalid = files.filter(f => !isAccepted(f));
    setPickedFiles(valid);
    if (invalid.length > 0) {
      setError(`Rejected: ${invalid.map(f => f.name).join(', ')}`);
    } else {
      setError('');
    }
  };

  // Simulate upload
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newFiles = pickedFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setPickedFiles([]);
      setUploading(false);
      setError('');
      if (onFileUpload) {
        newFiles.forEach(f => onFileUpload(f));
      }
    }, 800);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handlePick}
        disabled={uploading}
      />
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      {pickedFiles.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Ready to upload:</strong>
          <ul>
            {pickedFiles.map(f => (
              <li key={f.name + f.size}>{f.name} ({f.size} bytes)</li>
            ))}
          </ul>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Uploaded files:</strong>
          <ul>
            {uploadedFiles.map(f => (
              <li key={f.id}>
                {f.name} ({f.size} bytes) — Uploaded at {new Date(f.uploadedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
