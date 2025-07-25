// In file: /api/upload.js

// --- Switched to require for server-side Node.js environment compatibility ---
const { createClient } = require('@supabase/supabase-js');
const { Thor, Driver, SimpleWallet } = require('@vechain/sdk-core');
const { SimpleGasPrice, TransactionHandler } = require('@vechain/sdk-network');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

// --- Vercel config for file uploads ---
export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Switched to module.exports for CommonJS compatibility ---
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // --- Initialize clients ---
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const wallet = new SimpleWallet();
    wallet.import(process.env.VET_PRIVATE_KEY);
    const driver = await Driver.connect({
        node: process.env.VECHAIN_NODE_URL,
        wallet,
    });
    const thor = new Thor(driver);

    // --- Parse file and fields ---
    const form = formidable();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const documentFile = files.document?.[0];
    if (!documentFile) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // --- Calculate file hash ---
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // --- Build and send Vechain transaction ---
    const clause = thor.contracts.createContractTransaction('0x0000000000000000000000000000000000000000', '0', fileHash);
    const gasPrice = await SimpleGasPrice.create(driver);
    const body = await TransactionHandler.build(driver, [clause], { gasPrice });
    const signedTx = await driver.wallet.sign(body);
    const { id } = await thor.transactions.send(signedTx);

    // --- Save record to Supabase ---
    const { error: supabaseError } = await supabase.from(process.env.SUPABASE_TABLE).insert({
      tx_id: id,
      file_hash: fileHash,
      payment_intent_id: fields.paymentIntentId?.[0],
      original_filename: documentFile.originalFilename,
    });

    if (supabaseError) throw new Error(`Supabase error: ${supabaseError.message}`);

    // --- Success ---
    res.status(200).json({ txId: id, fileHash: fileHash });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};
