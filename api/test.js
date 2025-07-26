import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    // 1. Create a simple test hash
    const testData = "Hello VeChain";
    const hash = '0x' + crypto.createHash('sha256').update(testData).digest('hex');

    // 2. Get the latest block from VeChain (proves connection)
    // IMPORTANT: You must have VECHAIN_NODE_URL set in your Vercel Environment Variables
    const nodeUrl = process.env.VECHAIN_NODE_URL;
    if (!nodeUrl) {
      throw new Error("VECHAIN_NODE_URL is not set.");
    }

    const { data: block } = await axios.post(nodeUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1
    });

    if (!block.result) {
        throw new Error("Failed to connect to VeChain node.");
    }

    // 3. If we get here, everything worked.
    res.status(200).json({
      success: true,
      message: "VeChain connection is working!",
      testHash: hash,
      latestBlockNumber: parseInt(block.result.number, 16)
    });

  } catch (error) {
    // This will show the exact error in the Vercel logs
    console.error('--- TEST FAILED ---', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

