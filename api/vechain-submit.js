const { Framework } = require('@vechain/connex');
const { Driver, SimpleWallet } = require('@vechain/connex.driver-nodejs');

// Your prepaid VeChain configuration
const VECHAIN_CONFIG = {
  nodeUrl: process.env.VECHAIN_NODE_URL || 'https://testnet.veblocks.net',
  privateKey: process.env.VECHAIN_PRIVATE_KEY, // Your prepaid wallet private key
  gasLimit: 100000,
  gasCoef: 0
};

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
    const { fileHash, fileName, fileSize, timestamp } = req.body;

    if (!fileHash) {
      return res.status(400).json({ error: 'File hash is required' });
    }

    if (!VECHAIN_CONFIG.privateKey) {
      return res.status(500).json({ error: 'VeChain private key not configured' });
    }

    console.log('Submitting to VeChain:', { fileHash, fileName });

    // Initialize VeChain connection
    const wallet = new SimpleWallet();
    const imported = wallet.import(VECHAIN_CONFIG.privateKey);
    const driver = await Driver.connect(VECHAIN_CONFIG.nodeUrl, wallet);
    const connex = new Framework(driver);

    // Get the latest block for reference
    const best = connex.thor.status.head;

    // Prepare transaction to record the hash on VeChain
    const txBody = {
      to: imported, // Send to yourself (notarization pattern)
      value: 0, // No value transfer
      data: fileHash, // Document hash as transaction data
      gas: VECHAIN_CONFIG.gasLimit,
      gasCoef: VECHAIN_CONFIG.gasCoef
    };

    // Sign and send the transaction
    const txSigningService = connex.vendor.sign('tx');
    txSigningService.comment(`Document notarization: ${fileName}`);
    
    const txRequest = await txSigningService.request([txBody]);
    const transactionId = txRequest.txid;

    // Optional: Wait for transaction receipt
    let receipt = null;
    try {
      // Wait up to 30 seconds for confirmation
      const timeout = Date.now() + 30000;
      while (Date.now() < timeout) {
        receipt = await connex.thor.transaction(transactionId).getReceipt();
        if (receipt) break;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (receiptError) {
      console.log('Receipt check failed, but transaction was submitted:', receiptError.message);
    }

    // Store notarization record (optional - for your lookup system)
    const notarizationRecord = {
      document_id: `doc_${Date.now()}`,
      file_name: fileName,
      file_size: fileSize,
      content_hash: fileHash.replace('0x', ''),
      vechain_tx_id: transactionId,
      vechain_explorer_url: `https://explore-testnet.vechain.org/transactions/${transactionId}`,
      created_at: timestamp,
      status: receipt ? 'confirmed' : 'pending',
      block_number: receipt ? receipt.blockNumber : 'pending',
      gas_used: receipt ? receipt.gasUsed : 'pending',
      network: 'testnet',
      transaction_type: 'document_notarization',
      verification_status: receipt ? 'confirmed' : 'pending_confirmation'
    };

    console.log('VeChain transaction successful:', transactionId);

    res.status(200).json({
      success: true,
      message: 'Document hash successfully notarized on VeChain!',
      transactionId: transactionId,
      blockNumber: receipt ? receipt.blockNumber : 'pending',
      gasUsed: receipt ? receipt.gasUsed : 'pending',
      explorerUrl: `https://explore-testnet.vechain.org/transactions/${transactionId}`,
      fileHash: fileHash,
      fileName: fileName,
      notarizationRecord: notarizationRecord
    });

  } catch (error) {
    console.error('VeChain submission error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit to VeChain blockchain',
      details: 'Check server logs for more information'
    });
  }
}