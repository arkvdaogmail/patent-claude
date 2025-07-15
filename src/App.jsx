import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import PaymentArea from './components/PaymentArea'

function App() {
  const [health, setHealth] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    // Test the API connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('API connection failed:', err))
  }, [])

  const handleFileUpload = (fileInfo) => {
    console.log('File uploaded:', fileInfo)
    setUploadedFiles(prev => [...prev, fileInfo])
    // Here you could send the file to your server
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

        <div className="next-steps">
          <h3>Next Steps:</h3>
          <ul>
            <li>✅ Basic Express server running</li>
            <li>✅ React frontend connected</li>
            <li>✅ File upload functionality added</li>
            <li>✅ Stripe payment integration</li>
            <li>✅ Wallet connect (MetaMask, WalletConnect)</li>
            <li>🔧 Set up Supabase integration</li>
            <li>🔧 Add your business logic</li>
            <li>🧪 Write tests for your features</li>
          </ul>
        </div>
      </header>

      <div className="file-upload-section">
        <h2>📁 File Upload & Attachment</h2>
        <FileUpload onFileUpload={handleFileUpload} />
        
        {uploadedFiles.length > 0 && (
          <div className="upload-summary">
            <h3>Total Files Uploaded: {uploadedFiles.length}</h3>
            <p>Files are ready for processing with VeChain or Supabase!</p>
          </div>
        )}
      </div>

      <PaymentArea />
    </div>
  )
}

export default App