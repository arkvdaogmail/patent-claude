const { Framework } = require('@vechain/connex-framework');
const { Driver, SimpleNet } = require('@vechain/connex-driver');

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET and POST requests are supported'
    });
  }

  try {
    // Get hash from query parameter or request body
    let searchHash;
    if (req.method === 'GET') {
      searchHash = req.query.hash;
    } else {
      searchHash = req.body.hash;
    }

    if (!searchHash) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'hash parameter is required'
      });
    }

    // Validate hash format
    if (!searchHash.startsWith('0x') || searchHash.length !== 66) {
      return res.status(400).json({
        error: 'Invalid hash format',
        message: 'Hash must be a valid 32-byte hex string starting with 0x'
      });
    }

    // VeChain configuration
    const nodeUrl = process.env.VECHAIN_NODE_URL || 'https://testnet.veblocks.net';

    // Initialize VeChain connection
    const net = new SimpleNet(nodeUrl);
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);

    // First, check local lookup data
    const localResult = await checkLocalLookupData(searchHash);
    
    // Search blockchain for transactions containing this hash
    const blockchainResults = await searchBlockchainForHash(connex, searchHash);

    // Combine results
    const response = {
      success: true,
      hash: searchHash,
      timestamp: new Date().toISOString(),
      found: localResult !== null || blockchainResults.length > 0,
      localRecord: localResult,
      blockchainResults: blockchainResults,
      summary: {
        totalTransactions: blockchainResults.length,
        verified: blockchainResults.length > 0,
        network: 'VeChain Testnet'
      }
    };

    // Set CORS headers and return response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('Verification API Error:', error);
    
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

// Helper function to check local lookup data
async function checkLocalLookupData(hash) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const lookupDir = path.join(process.cwd(), 'lookup-data');
    const hashFile = path.join(lookupDir, `${hash}.json`);
    
    try {
      const data = await fs.readFile(hashFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return null; // File doesn't exist
    }
  } catch (error) {
    console.error('Error checking local lookup data:', error);
    return null;
  }
}

// Helper function to search blockchain for hash
async function searchBlockchainForHash(connex, targetHash) {
  try {
    const results = [];
    
    // Get current block
    const currentBlock = await connex.thor.status.get();
    const currentBlockNumber = currentBlock.head.number;
    
    // Search recent blocks (last 1000 blocks or less)
    const blocksToSearch = Math.min(1000, currentBlockNumber);
    const startBlock = Math.max(0, currentBlockNumber - blocksToSearch);
    
    console.log(`Searching blocks ${startBlock} to ${currentBlockNumber} for hash ${targetHash}`);
    
    // Search through recent blocks
    for (let blockNum = currentBlockNumber; blockNum >= startBlock; blockNum -= 10) {
      try {
        const block = await connex.thor.block(blockNum).get();
        if (!block || !block.transactions) continue;
        
        // Check each transaction in the block
        for (const txId of block.transactions) {
          try {
            const tx = await connex.thor.transaction(txId).get();
            if (!tx || !tx.clauses) continue;
            
            // Check each clause for our target hash
            for (const clause of tx.clauses) {
              if (clause.data && clause.data.toLowerCase() === targetHash.toLowerCase()) {
                // Found a match!
                const receipt = await connex.thor.transaction(txId).getReceipt();
                
                results.push({
                  transactionId: txId,
                  blockNumber: blockNum,
                  blockId: block.id,
                  timestamp: new Date(block.timestamp * 1000).toISOString(),
                  from: tx.origin,
                  to: clause.to,
                  value: clause.value,
                  data: clause.data,
                  gasUsed: receipt ? receipt.gasUsed : 'unknown',
                  status: receipt ? (receipt.reverted ? 'reverted' : 'success') : 'unknown',
                  explorerUrl: `https://explore-testnet.vechain.org/transactions/${txId}`
                });
              }
            }
          } catch (txError) {
            // Skip this transaction if there's an error
            console.warn(`Error processing transaction ${txId}:`, txError.message);
          }
        }
      } catch (blockError) {
        // Skip this block if there's an error
        console.warn(`Error processing block ${blockNum}:`, blockError.message);
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error searching blockchain:', error);
    return [];
  }
}

// Helper function to get transaction by ID
export async function getTransactionById(txId) {
  try {
    const nodeUrl = process.env.VECHAIN_NODE_URL || 'https://testnet.veblocks.net';
    const net = new SimpleNet(nodeUrl);
    const driver = await Driver.connect(net);
    const connex = new Framework(driver);
    
    const tx = await connex.thor.transaction(txId).get();
    const receipt = await connex.thor.transaction(txId).getReceipt();
    
    return {
      transaction: tx,
      receipt: receipt
    };
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
}