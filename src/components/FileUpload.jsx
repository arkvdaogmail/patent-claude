iimport React, { useRef, useState } from 'react';

const ACCEPTED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/json', 'text/csv'
];

const ACCEPTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx', '.json', '.csv'
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onFileUpload }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file =>
      ACCEPTED_FILE_TYPES.includes(file.type) && file.size <= MAX_SIZE
    );

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please upload only images, PDFs, documents, or text files under 10MB.');
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    // Upload files to server
    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Assume result.files is an array of file info
      (result.files || []).forEach(fileInfo => {
        setUploadedFiles(prev => [...prev, {
          ...fileInfo,
          status: 'completed'
        }]);
        if (onFileUpload) {
          onFileUpload(fileInfo);
        }
      });

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }

    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Drop files here or click to select</h3>
          <p>Support for images, PDFs, documents, and text files (max 10MB each)</p>

          <input
            type="file"
            multiple
            ref={inputRef}
            onChange={handleFileSelect}
            className="file-input"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            style={{ display: 'none' }}
          />

          <button
            className="upload-button"
            onClick={() => inputRef.current && inputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </button>
        </div>
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Uploading files...</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files ({uploadedFiles.length})</h4>
          <div className="files-list">
            {uploadedFiles.map(file => (
              <div key={file.id || file.filename || file.name} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {file.type?.startsWith('image/') ? '🖼️' :
                      file.type === 'application/pdf' ? '📄' :
                        file.type?.includes('document') || /\.(doc|docx)$/i.test(file.filename || file.name) ? '📝' : '📋'}
                  </span>
                  <div className="file-details">
                    <div className="file-name">{file.filename || file.name}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <button className="remove-file" onClick={() => removeFile(file.id || file.filename || file.name)}>❌</button>
                </div>
                <div className="file-status">{file.status || 'uploaded'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
