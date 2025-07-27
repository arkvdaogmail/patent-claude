const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

export default async function handler(req, res) {
  // CORS headers
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
        resolve({ fields, files });
      });
    });

    const documentFile = files.document?.[0] || files.file?.[0];
    if (!documentFile) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // Calculate file hash
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // Mock VeChain transaction (replace with real VeChain later)
    const mockTxId = 'vechain_tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    res.status(200).json({
      success: true,
      message: 'Document uploaded and notarized successfully!',
      fileHash: fileHash,
      transactionId: mockTxId,
      fileName: documentFile.originalFilename,
      fileSize: documentFile.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message || 'Upload failed',
      details: 'Check server logs for more information'
    });
  }
}