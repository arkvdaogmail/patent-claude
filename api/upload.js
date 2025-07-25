// In file: /api/upload.js

const { createClient } = require('@supabase/supabase-js');
// --- FIX: Switched VeChain imports to use require ---
const { Thor, Driver, SimpleWallet } = require('@vechain/sdk-core');
const { SimpleGasPrice, TransactionHandler } = require('@vechain/sdk-network');
// --- End of Fix ---
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

// --- IMPORTANT: This tells Vercel how to handle the request ---
export const config = {
  api: {
    bodyParser: false,
  },
};

// Use module.exports for consistency with require
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- Step 1: Initialize Supabase and Vechain clients ---
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const wallet = new SimpleWallet();
  wallet.import(process.env.VET_PRIVATE_KEY);
  const driver = await Driver.connect({
      node: process.env.VECHAIN_NODE_URL,
      wallet,
  });
  const thor = new Thor(driver);

  // --- Step 2: Parse the incoming form data (file and fields) ---
  const form = formidable();
  try {
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

    // --- Step 3: Read the file and calculate its hash ---
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // --- Step 4: Create a Vechain transaction ---
    const clause = thor.contracts.createContractTransaction(
        '0x0000000000000000000000000000000000000000', // A placeholder address
        '0', // Amount of VET to send (zero)
        fileHash // The document hash is the data we store on-chain
    );

    const gasPrice = await SimpleGasPrice.create(driver);
    const body = await TransactionHandler.build(driver, [clause], { gasPrice });
    const signedTx = await driver.wallet.sign(body);
    const { id } = await thor.transactions.send(signedTx);

    // --- Step 5: Save the record to Supabase ---
    const { error: supabaseError } = await supabase.from(process.env.SUPABASE_TABLE).insert({
      tx_id: id,
      file_hash: fileHash,
      payment_intent_id: fields.paymentIntentId?.[0],
      user_id: fields.userId?.[0],
      original_filename: documentFile.originalFilename,
    });

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // --- Step 6: Send the successful response ---
    res.status(200).json({ txId: id, fileHash: fileHash });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};
