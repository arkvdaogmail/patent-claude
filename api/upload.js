// In file: /api/upload.js

const { createClient } = require('@supabase/supabase-js');
const { Thor, Driver, SimpleWallet } = require('@vechain/sdk-core');
const { SimpleGasPrice, TransactionHandler } = require('@vechain/sdk-network');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

// Vercel config to allow file uploads (multipart/form-data)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Use module.exports for Node.js/CommonJS compatibility in Vercel Functions
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Step 1: Initialize API clients
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const wallet = new SimpleWallet();
    wallet.import(process.env.VET_PRIVATE_KEY);
    const driver = await Driver.connect({
        node: process.env.VECHAIN_NODE_URL,
        wallet,
    });
    const thor = new Thor(driver);

    // Step 2: Parse incoming file and associated form fields
    const form = formidable();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const documentFile = files.document?.[0];
    if (!documentFile) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // Step 3: Read the uploaded file and calculate its SHA256 hash
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');

    // Step 4: Build and send the Vechain transaction with the file hash
    const clause = thor.contracts.createContractTransaction('0x0000000000000000000000000000000000000000', '0', fileHash);
    const gasPrice = await SimpleGasPrice.create(driver);
    const body = await TransactionHandler.build(driver, [clause], { gasPrice });
    const signedTx = await driver.wallet.sign(body);
    const { id } = await thor.transactions.send(signedTx);

    // Step 5: Save the transaction details to your Supabase database
    const { error: supabaseError } = await supabase.from(process.env.SUPABASE_TABLE).insert({
      tx_id: id,
      file_hash: fileHash,
      payment_intent_id: fields.paymentIntentId?.[0],
      original_filename: documentFile.originalFilename,
    });

    if (supabaseError) {
      // If Supabase fails, throw an error to be caught below
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    // Step 6: Send a successful response back to the frontend
    res.status(200).json({ txId: id, fileHash: fileHash });

  } catch (error) {
    // Catch any error from the process and log it for debugging
    console.error('Upload Function Error:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};

