// In file: /src/App.jsx

import { useState } from 'react';
import StripePayment from './components/StripePayment';
import UploadAfterPayment from './components/UploadAfterPayment';
import './App.css'; // Make sure this import is here!

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setPaymentIntentId(null); // Reset payment status if a new file is chosen
    }
  };

  // This function is called by StripePayment when payment is successful
  const handlePaymentSuccess = (id) => {
    setPaymentIntentId(id);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Document Notarization Service</h1>
      </header>

      <main className="content-area">
        
        {/* Step 1: File Selection */}
        <div className="card">
          <h2>1. Select Your Document</h2>
          <p>Choose the document you wish to notarize on the Vechain blockchain.</p>
          <input type="file" onChange={handleFileChange} />
        </div>

        {/* Step 2: Review and Pay (only shows after a file is selected) */}
        {file && !paymentIntentId && (
          <div className="card">
            <h2>2. Review and Pay</h2>
            <p>You have selected: <strong>{fileName}</strong></p>
            <p>Proceed with payment to notarize this document.</p>
            <StripePayment
              onPaymentSuccess={handlePaymentSuccess}
              fileName={fileName}
            />
          </div>
        )}

        {/* Step 3: Notarize and Publish (only shows after payment is successful) */}
        {paymentIntentId && (
          <div className="card">
            <h2>3. Notarize and Publish</h2>
            <p>Payment successful! Now, click the button below to publish the proof of your document to the blockchain.</p>
            {/* This component now receives the file directly */}
            <UploadAfterPayment
              fileToUpload={file} 
              paymentIntentId={paymentIntentId}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
