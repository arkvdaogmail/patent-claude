import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import PaymentArea from './components/PaymentArea'

function App() {
  const [health, setHealth] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // MOCK: Remove all real fetch calls. Just set fake health data.
    setTimeout(() => {
      setHealth({
        status: 'healthy',
        message: 'Mocked API: UI-only mode'
      })
    }, 400)
  }, [])

  const handleFileUpload = (fileInfo) => {
    setUploadedFiles(prev => [...prev, fileInfo])
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🦉 Owl App</h1>
        <p>Welcome to your VeChain + Supabase + React application!</p>
        <div className="status-card">
          <h3>Server Status</h3>
          {health ? (
            <div className="status-ok">
              ✅ {health.message}
            </div>
          ) : (
            <div className="status-loading">
              🔄 Checking server connection...
            </div>
          )}
        </div>
      </header>
      <div className="file-upload-section">
        <h2>📁 File Upload & Attachment</h2>
        <FileUpload onFileUpload={handleFileUpload} />
        {uploadedFiles.length > 0 && (
          <div className="upload-summary">
            <h3>Total Files Uploaded: {uploadedFiles.length}</h3>
            <p>Files are ready for processing!</p>
          </div>
        )}
      </div>
      <PaymentArea />
    </div>
  )
}

export default App
