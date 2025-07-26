import formidable from 'formidable';
import fs from 'fs';
import crypto from 'crypto';

// This config line is important for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// This is the main function Vercel will run
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
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

    // --- CORE TRUST ENGINE LOGIC ---
    // 1. Calculate the file's SHA-256 hash
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // 2. Simulate the VeChain transaction
    const mockTxId = '0x' + crypto.createHash('sha256').update(fileHash + Date.now()).digest('hex').slice(0, 64);

    // 3. Return the successful result
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
}


