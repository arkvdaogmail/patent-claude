import { useState } from 'react';
import './App.css';
import StripePayment from './components/StripePayment';
import UploadAfterPayment from './components/UploadAfterPayment';
import CertificatePage from './components/CertificatePage';
import LookupPage from './components/LookupPage';

function App() {
  const [currentPage, setCurrentPage] = useState('upload'); // 'upload', 'certificate', 'lookup'
  const [selectedFile, setSelectedFile] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [notarizationResult, setNotarizationResult] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handlePaymentSuccess = (intentId) => {
    setPaymentIntentId(intentId);
  };

  const handleNotarizationSuccess = (result) => {
    setNotarizationResult(result);
    setCurrentPage('certificate');
  };

  const resetToUpload = () => {
    setCurrentPage('upload');
    setSelectedFile(null);
    setPaymentIntentId(null);
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
            Notarize Document
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
              <h2>1. Select Your Document</h2>
              <p>Choose the document you wish to notarize on the VeChain blockchain.</p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
                className="file-input"
              />
              {selectedFile && (
                <p className="file-selected">
                  Selected: <strong>{selectedFile.name}</strong>
                </p>
              )}
            </section>

            {selectedFile && (
              <section className="payment-section">
                <h2>2. Review and Pay</h2>
                <p>You have selected: <strong>{selectedFile.name}</strong></p>
                <p>Proceed with payment to notarize this document.</p>
                <StripePayment 
                  onPaymentSuccess={handlePaymentSuccess}
                  fileName={selectedFile.name}
                />
              </section>
            )}

            {paymentIntentId && (
              <section className="notarization-section">
                <h2>3. Notarize and Publish</h2>
                <UploadAfterPayment
                  fileToUpload={selectedFile}
                  paymentIntentId={paymentIntentId}
                  onSuccess={handleNotarizationSuccess}
                />
              </section>
            )}
          </div>
        )}

        {currentPage === 'certificate' && (
          <div className="certificate-flow">
            <CertificatePage 
              result={notarizationResult}
              fileName={selectedFile?.name}
            />
            <button onClick={resetToUpload} className="new-document-button">
              Notarize Another Document
            </button>
          </div>
        )}

        {currentPage === 'lookup' && (
          <LookupPage />
        )}
      </main>
    </div>
  );
}

export default App;
