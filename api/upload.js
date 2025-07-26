import formidable from 'formidable';
import fs from 'fs';
import crypto from 'crypto';
import { Framework } from '@vechain/connex';
import { Driver, SimpleWallet } from '@vechain/connex.driver-nodejs';

// Set up VeChain connection details from environment variables
const NODE_URL = process.env.VECHAIN_NODE_URL;
const PRIVATE_KEY = process.env.VECHAIN_PRIVATE_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!NODE_URL || !PRIVATE_KEY) {
    return res.status(500).json({ error: 'VeChain node URL or private key not set.' });
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

    // 1. Calculate SHA-256 hash of the file
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // 2. Set up the wallet and blockchain connection
    const wallet = new SimpleWallet();
    const imported = wallet.import(PRIVATE_KEY);
    const driver = await Driver.connect(NODE_URL, wallet);
    const connex = new Framework(driver);

    // 3. Prepare transaction (send 0 VET with fileHash in data field)
    const txBody = {
      to: imported, // send to self
      value: 0,
      data: fileHash, // file hash as data
    };

    // 4. Sign and send transaction
    const txSigningService = connex.vendor.sign('tx');
    txSigningService.comment('Notarize document hash');
    const txRequest = await txSigningService.request([txBody]);
    const txid = txRequest.txid;

    // 5. Optional: Wait for confirmation (optional, can remove if not needed)
    // await connex.thor.transaction(txid).getReceipt();

    // 6. Respond with real transaction ID and hash
    res.status(200).json({
      success: true,
      message: 'Document notarized on VeChain!',
      fileHash: fileHash,
      transactionId: txid,
    });

  } catch (error) {
    console.error('Core Engine Error:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
