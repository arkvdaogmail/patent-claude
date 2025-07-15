import { useState, useCallback } from 'react'
import './FileUpload.css'

function FileUpload({ onFileUpload }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }, [])

  const handleFiles = async (files) => {
    setUploading(true)
    
    const validFiles = files.filter(file => {
      // Allow common file types
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/json', 'text/csv'
      ]
      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please upload only images, PDFs, documents, or text files under 10MB.')
    }

    // Upload files to server
    try {
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      result.files.forEach(fileInfo => {
        setUploadedFiles(prev => [...prev, {
          ...fileInfo,
          status: 'completed'
        }])
        
        // Call parent callback if provided
        if (onFileUpload) {
          onFileUpload(fileInfo)
        }
      })
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }
    
    setUploading(false)
  }



  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

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
            onChange={handleFileSelect}
            className="file-input"
            accept="image/*,.pdf,.doc,.docx,.txt,.json,.csv"
          />
          
          <button 
            className="upload-button"
            onClick={() => document.querySelector('.file-input').click()}
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
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {file.type.startsWith('image/') ? '🖼️' : 
                     file.type === 'application/pdf' ? '📄' : 
                     file.type.includes('document') ? '📝' : '📋'}
                  </span>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button 
                  className="remove-button"
                  onClick={() => removeFile(file.id)}
                  title="Remove file"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload