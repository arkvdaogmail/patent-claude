import { useState } from 'react';

function ApiTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`/api/${endpoint}`, options);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data: data,
          success: response.ok
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'ERROR',
          data: error.message,
          success: false
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  const testFileUpload = async () => {
    setLoading(prev => ({ ...prev, 'upload': true }));
    try {
      // Create a test file
      const testContent = 'This is a test document for notarization.';
      const testFile = new File([testContent], 'test-document.txt', { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('description', 'Test document upload');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        'upload': {
          status: response.status,
          data: data,
          success: response.ok
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        'upload': {
          status: 'ERROR',
          data: error.message,
          success: false
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, 'upload': false }));
    }
  };

  return (
    <div className="api-test">
      <h2>API Endpoint Tests</h2>
      
      <div className="test-buttons">
        <button 
          onClick={() => testEndpoint('health')}
          disabled={loading['health']}
        >
          {loading['health'] ? 'Testing...' : 'Test Health'}
        </button>
        
        <button 
          onClick={() => testEndpoint('test')}
          disabled={loading['test']}
        >
          {loading['test'] ? 'Testing...' : 'Test Basic'}
        </button>
        
        <button 
          onClick={() => testEndpoint('lookup', 'POST', { hash: 'test-hash' })}
          disabled={loading['lookup']}
        >
          {loading['lookup'] ? 'Testing...' : 'Test Lookup'}
        </button>
        
        <button 
          onClick={() => testEndpoint('create-payment-intent', 'POST', { amount: 1000 })}
          disabled={loading['create-payment-intent']}
        >
          {loading['create-payment-intent'] ? 'Testing...' : 'Test Payment Intent'}
        </button>
        
        <button 
          onClick={testFileUpload}
          disabled={loading['upload']}
        >
          {loading['upload'] ? 'Testing...' : 'Test File Upload'}
        </button>
        
        <button 
          onClick={() => testEndpoint('hash-and-chain', 'POST', { 
            hash: 'test-hash-123',
            description: 'Test document'
          })}
          disabled={loading['hash-and-chain']}
        >
          {loading['hash-and-chain'] ? 'Testing...' : 'Test Hash & Chain'}
        </button>
      </div>

      <div className="results">
        {Object.entries(results).map(([endpoint, result]) => (
          <div key={endpoint} className={`result ${result.success ? 'success' : 'error'}`}>
            <h3>{endpoint}</h3>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Success:</strong> {result.success ? '✅' : '❌'}</p>
            <details>
              <summary>Response Data</summary>
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>

      <style jsx>{`
        .api-test {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .test-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .test-buttons button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          background: #007bff;
          color: white;
          cursor: pointer;
          font-size: 14px;
        }
        
        .test-buttons button:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .test-buttons button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .results {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .result {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
        }
        
        .result.success {
          border-color: #28a745;
          background: #f8fff9;
        }
        
        .result.error {
          border-color: #dc3545;
          background: #fff8f8;
        }
        
        .result h3 {
          margin: 0 0 10px 0;
          text-transform: uppercase;
        }
        
        .result p {
          margin: 5px 0;
        }
        
        .result pre {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 3px;
          overflow-x: auto;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

export default ApiTest;