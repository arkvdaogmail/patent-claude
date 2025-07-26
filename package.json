// In file: /api/upload.js

const { createClient } = require('@supabase/supabase-js');
const { Thor, Driver, SimpleWallet } = require('@vechain/sdk-core');
const { SimpleGasPrice, TransactionHandler } = require('@vechain/sdk-network');
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');

export const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  console.log('--- DEBUG: /api/upload function started ---');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Step 1: Initialize clients
    console.log('--- DEBUG: Step 1: Initializing clients...');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    console.log('--- DEBUG: Supabase client created.');

    const wallet = new SimpleWallet();
    console.log('--- DEBUG: SimpleWallet instantiated.');

    wallet.import(process.env.VET_PRIVATE_KEY);
    console.log('--- DEBUG: Wallet imported from private key.');

    const driver = await Driver.connect({
        node: process.env.VECHAIN_NODE_URL,
        wallet,
    });
    console.log('--- DEBUG: VeChain driver connected.');

    const thor = new Thor(driver);
    console.log('--- DEBUG: Thor instance created.');

    // Step 2: Parse form
    console.log('--- DEBUG: Step 2: Parsing form data...');
    const form = formidable();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    console.log('--- DEBUG: Form parsing complete.');

    const documentFile = files.document?.[0];
    if (!documentFile) {
      console.error('--- DEBUG ERROR: No document file found in form.');
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // Step 3: Calculate hash
    console.log('--- DEBUG: Step 3: Calculating file hash...');
    const fileData = fs.readFileSync(documentFile.filepath);
    const fileHash = '0x' + crypto.createHash('sha256').update(fileData).digest('hex');
    console.log(`--- DEBUG: File hash calculated: ${fileHash}`);

    // Step 4: Vechain transaction
    console.log('--- DEBUG: Step 4: Building VeChain transaction...');
    const clause = thor.contracts.createContractTransaction('0x0000000000000000000000000000000000000000', '0', fileHash);
    const gasPrice = await SimpleGasPrice.create(driver);
    const body = await TransactionHandler.build(driver, [clause], { gasPrice });
    const signedTx = await driver.wallet.sign(body);
    const { id } = await thor.transactions.send(signedTx);
    console.log(`--- DEBUG: Transaction sent. TxID: ${id}`);

    // Step 5: Save to Supabase
    console.log('--- DEBUG: Step 5: Saving to Supabase...');
    const { error: supabaseError } = await supabase.from(process.env.SUPABASE_TABLE).insert({
      tx_id: id,
      file_hash: fileHash,
      payment_intent_id: fields.paymentIntentId?.[0],
      original_filename: documentFile.originalFilename,
    });

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }
    console.log('--- DEBUG: Record saved to Supabase.');

    // Step 6: Success
    console.log('--- DEBUG: Step 6: Sending success response.');
    res.status(200).json({ txId: id, fileHash: fileHash });

  } catch (error) {
    console.error('--- DEBUG CATCH BLOCK: An error was caught ---');
    console.error(error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};

