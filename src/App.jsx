import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import PaymentArea from './components/PaymentArea'

function App() {
  const [health, setHealth] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test the API connection with error handling
    fetch('/api/health')
      .then(res => {
        if (!res.ok) {
          throw new Error('API not available')
        }
        return res.json()
      })
      .then(data => setHealth(data))
      .catch(err => {
        console.error('API connection failed:', err)
        setError('API connection failed - running in frontend-only mode')
      })
  }, [])

  const handleFileUpload = (fileInfo) => {
    console.log('File uploaded:', fileInfo)
    setUploadedFiles(prev => [...prev, fileInfo])
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🦉 Owl App</h1>
          <p>Welcome to your React + Vite application!</p>
          
          <div className="error-card">
            <h3>⚠️ Backend Not Available</h3>
            <p>{error}</p>
            <p>The frontend is working! Deploy to Vercel to enable full functionality.</p>
          </div>
        </header>
      </div>
    )
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