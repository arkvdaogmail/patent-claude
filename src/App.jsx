import { useState } from 'react';
import './App.css';
import UploadAfterPayment from './components/UploadAfterPayment';
import CertificatePage from './components/CertificatePage';
import LookupPage from './components/LookupPage';
import ApiTest from './components/ApiTest';

function App() {
  const [currentPage, setCurrentPage] = useState('upload'); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [notarizationResult, setNotarizationResult] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleNotarizationSuccess = (result) => {
    setNotarizationResult(result);
    setCurrentPage('certificate');
  };

  const resetToUpload = () => {
    setCurrentPage('upload');
    setSelectedFile(null);
    setNotarizationResult(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Document Notarization Service</h1>
        <nav className="navigation">
          <button 
            onClick={() => setCurrentPage('upload')}
            className={currentPage === 'upload' ? 'active' : ''}
          >
            Upload Document
          </button>
          <button 
            onClick={() => setCurrentPage('api-test')}
            className={currentPage === 'api-test' ? 'active' : ''}
          >
            API Test
          </button>
          <button 
            onClick={() => setCurrentPage('lookup')}
            className={currentPage === 'lookup' ? 'active' : ''}
          >
            Lookup Document
          </button>
        </nav>
      </header>

      <main className="App-main">
        {currentPage === 'upload' && (
          <div className="upload-flow">
            <section className="file-selection">
              <h2>Select Document to Notarize</h2>
              <p>Choose a document to hash and store on VeChain blockchain (payment skipped for testing)</p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="file-input"
              />
              {selectedFile && (
                <div>
                  <p className="file-selected">
                    Selected: <strong>{selectedFile.name}</strong>
                  </p>
                  <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                  <p>Type: {selectedFile.type || 'Unknown'}</p>
                </div>
              )}
            </section>

            {selectedFile && (
              <section className="notarization-section">
                <h2>Process with VeChain</h2>
                <UploadAfterPayment
                  fileToUpload={selectedFile}
                  paymentIntentId="test-payment-skipped"
                  onSuccess={handleNotarizationSuccess}
                />
              </section>
            )}
          </div>
        )}

        {currentPage === 'api-test' && (
          <ApiTest />
        )}

        {currentPage === 'lookup' && (
          <LookupPage />
        )}

        {currentPage === 'certificate' && notarizationResult && (
          <CertificatePage 
            result={notarizationResult}
            fileName={selectedFile?.name}
            onNewDocument={resetToUpload}
          />
        )}
      </main>
    </div>
  );
}

export default App;
