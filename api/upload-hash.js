const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex-driver');
const { cry } = require('@vechain/thor-devkit');

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { fileHash, fileName, fileSize } = req.body;

    if (!fileHash) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'fileHash is required'
      });
    }

    // Validate hash format
    if (!fileHash.startsWith('0x') || fileHash.length !== 66) {
      return res.status(400).json({
        error: 'Invalid hash format',
        message: 'Hash must be a valid 32-byte hex string starting with 0x'
      });
    }

    // VeChain configuration
    const nodeUrl = process.env.VECHAIN_NODE_URL || 'https://testnet.veblocks.net';
    const privateKey = process.env.VECHAIN_PRIVATE_KEY;

    if (!privateKey) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'VeChain private key not configured'
      });
    }

    // Initialize VeChain connection
    const net = new SimpleNet(nodeUrl);
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);

    // Generate wallet from private key
    const wallet = cry.secp256k1.generateKeyPair(Buffer.from(privateKey.slice(2), 'hex'));
    const address = cry.publicKeyToAddress(wallet.publicKey);
    const addressHex = '0x' + address.toString('hex');

    // Get account info
    const account = connex.thor.account(addressHex);
    const accountInfo = await account.get();

    // Check balance (optional - for logging)
    console.log(`Account balance: ${accountInfo.balance} WEI`);

    // Create transaction clause
    const clause = {
      to: addressHex,  // Send to yourself
      value: '0x0',    // 0 VET
      data: fileHash   // Document hash as transaction data
    };

    // Build transaction
    const transaction = connex.thor.transaction([clause]);
    
    // Get current block info for gas estimation
    const currentBlock = await connex.thor.status.get();
    const blockRef = currentBlock.head.id.slice(0, 18); // First 8 bytes as hex

    // Estimate gas
    let gasEstimate;
    try {
      gasEstimate = await transaction.estimate();
      console.log(`Gas estimate: ${gasEstimate.gas}`);
    } catch (error) {
      console.warn('Gas estimation failed, using default gas limit');
      gasEstimate = { gas: 100000 };
    }

    // Sign and send transaction
    const signingHash = cry.blake2b256([
      Buffer.from(blockRef.slice(2), 'hex'),
      Buffer.from('00000000', 'hex'), // chainTag (testnet = 0x27, mainnet = 0x4a)
      Buffer.from('0000000000000000', 'hex'), // expiration
      Buffer.from(clause.to.slice(2), 'hex'),
      Buffer.from(clause.value.slice(2), 'hex'),
      Buffer.from(clause.data.slice(2), 'hex'),
      Buffer.from(gasEstimate.gas.toString(16).padStart(16, '0'), 'hex'),
      Buffer.from('00', 'hex'), // gasPriceCoef
      Buffer.from('00000000', 'hex'), // nonce
      Buffer.from('', 'hex') // reserved
    ]);

    // Sign the transaction
    const signature = cry.secp256k1.sign(signingHash, Buffer.from(privateKey.slice(2), 'hex'));
    
    // Prepare raw transaction
    const rawTransaction = {
      chainTag: 0x27, // VeChain testnet
      blockRef: blockRef,
      expiration: 32,
      clauses: [clause],
      gasPriceCoef: 0,
      gas: gasEstimate.gas,
      dependsOn: null,
      nonce: Date.now(),
      signature: '0x' + signature.toString('hex')
    };

    // Send transaction to VeChain network
    let txResponse;
    try {
      txResponse = await connex.thor.transaction([clause]).request();
    } catch (error) {
      console.error('Transaction failed:', error);
      return res.status(500).json({
        error: 'Transaction failed',
        message: error.message,
        details: 'Failed to submit transaction to VeChain blockchain'
      });
    }

    // Create response data
    const responseData = {
      success: true,
      transaction: {
        id: txResponse.txid,
        hash: fileHash,
        fileName: fileName || 'Unknown',
        fileSize: fileSize || 0,
        timestamp: new Date().toISOString(),
        block: currentBlock.head.number,
        gasUsed: gasEstimate.gas,
        explorerUrl: `https://explore-testnet.vechain.org/transactions/${txResponse.txid}`,
        network: 'VeChain Testnet'
      },
      wallet: {
        address: addressHex,
        balance: accountInfo.balance
      },
      blockchain: {
        nodeUrl: nodeUrl,
        chainTag: 0x27,
        blockRef: blockRef
      }
    };

    // Store transaction data for lookup
    await storeTransactionData(txResponse.txid, fileHash, fileName, fileSize);

    // Set CORS headers and return response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('API Error:', error);
    
    // Set CORS headers for error responses too
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Helper function to store transaction data
async function storeTransactionData(txId, fileHash, fileName, fileSize) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const lookupDir = path.join(process.cwd(), 'lookup-data');
    
    // Ensure directory exists
    try {
      await fs.access(lookupDir);
    } catch {
      await fs.mkdir(lookupDir, { recursive: true });
    }

    // Create transaction record
    const transactionData = {
      id: txId,
      document_hash: fileHash,
      file_name: fileName || 'Unknown',
      file_size: fileSize || 0,
      timestamp: new Date().toISOString(),
      vechain_tx_id: txId,
      vechain_explorer_url: `https://explore-testnet.vechain.org/transactions/${txId}`,
      network: 'VeChain Testnet',
      status: 'submitted',
      gas_used: 'pending',
      block_number: 'pending'
    };

    // Store by transaction ID
    await fs.writeFile(
      path.join(lookupDir, `${txId}.json`),
      JSON.stringify(transactionData, null, 2)
    );

    // Store by hash for lookup
    await fs.writeFile(
      path.join(lookupDir, `${fileHash}.json`),
      JSON.stringify(transactionData, null, 2)
    );

    // Update index
    let index = [];
    try {
      const indexData = await fs.readFile(path.join(lookupDir, 'index.json'), 'utf8');
      index = JSON.parse(indexData);
    } catch {
      // Index doesn't exist yet
    }

    index.push({
      txId: txId,
      hash: fileHash,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(
      path.join(lookupDir, 'index.json'),
      JSON.stringify(index, null, 2)
    );

  } catch (error) {
    console.error('Failed to store transaction data:', error);
    // Don't throw - this is not critical for the main function
  }
}