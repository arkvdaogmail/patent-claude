import { ThorClient } from "@vechain/sdk-network";
import { buildErrorResponse, buildSuccessResponse } from "../_utils/response-builder";

// Initialize ThorClient to connect to the VeChain testnet
const thorClient = new ThorClient("https://testnet.vechain.org/" );

export default async function handler(req, res) {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return buildErrorResponse(res, 405, 'Method Not Allowed');
  }

  try {
    const { hash } = req.body;

    // Basic validation
    if (!hash || typeof hash !== 'string' || !hash.startsWith('0x')) {
      return buildErrorResponse(res, 400, 'Invalid or missing hash parameter.');
    }

    // For now, we just check the connection by getting the genesis block
    const genesisBlock = await thorClient.blocks.get(0);

    if (!genesisBlock) {
      throw new Error('Failed to connect to VeChain testnet.');
    }

    // Respond with a success message (actual transaction will be added later)
    return buildSuccessResponse(res, {
      message: "Successfully connected to VeChain and received hash.",
      receivedHash: hash,
      genesisBlockId: genesisBlock.id
    });

  } catch (error) {
    console.error(error);
    return buildErrorResponse(res, 500, 'Internal Server Error', error.message);
  }
}
