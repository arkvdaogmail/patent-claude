const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

// This is the main function Vercel will run
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Parse the uploaded file from the form data
    const form = formidable();
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const documentFile = files.document?.[0];
    if (!documentFile) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // 2. Calculate the file's SHA-256 hash
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // 3. --- MOCK VECHAIN TRANSACTION ---
    // For this test, we will simulate the VeChain part to keep it simple and fast.
    // We will generate a fake transaction ID.
    const mockTxId = '0x' + crypto.createHash('sha256').update(fileHash + Date.now()).digest('hex').slice(0, 64);

    // 4. Return the successful result
    res.status(200).json({
      success: true,
      message: 'Core Engine Test Successful!',
      fileHash: fileHash,
      transactionId: mockTxId
    });

  } catch (error) {
    console.error('Core Engine Error:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};

