const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

// For now, let's create a simple API that doesn't depend on VeChain to test the basic upload
// We'll add VeChain back once the basic upload works

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('API upload called');
    
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err);
          return reject(err);
        }
        console.log('Form parsed successfully');
        resolve({ fields, files });
      });
    });

    console.log('Files received:', Object.keys(files));
    
    const documentFile = files.document?.[0] || files.file?.[0];
    if (!documentFile) {
      console.log('No file found in upload');
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    console.log('File details:', {
      name: documentFile.originalFilename,
      size: documentFile.size,
      type: documentFile.mimetype
    });

    // Calculate SHA-256 hash of the file
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');
    
    console.log('File hash calculated:', fileHash);

    // For now, return a mock transaction ID instead of using VeChain
    const mockTxId = 'mock_tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Respond with the hash and mock transaction ID
    res.status(200).json({
      success: true,
      message: 'Document processed successfully!',
      fileHash: fileHash,
      transactionId: mockTxId,
      fileName: documentFile.originalFilename,
      fileSize: documentFile.size
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message || 'An internal server error occurred.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
