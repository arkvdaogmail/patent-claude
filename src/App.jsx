import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    // Test the API connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('API connection failed:', err))
  }, [])

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
            <li>🔧 Add VeChain wallet connection</li>
            <li>🔧 Set up Supabase integration</li>
            <li>🔧 Add your business logic</li>
            <li>🧪 Write tests for your features</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default App