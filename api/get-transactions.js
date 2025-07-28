// api/get-transactions.js

import { ThorClient } from "@vechain/sdk-network";
import { buildErrorResponse, buildSuccessResponse } from "../_utils/response-builder";

// Initialize ThorClient from environment variables
const thorClient = new ThorClient(process.env.VECHAIN_NODE_URL || "https://testnet.vechain.org/" );
const fromAddress = process.env.VECHAIN_FROM_ADDRESS;

if (!fromAddress) {
  throw new Error("VECHAIN_FROM_ADDRESS is not set in environment variables.");
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return buildErrorResponse(res, 405, 'Method Not Allowed');
  }

  try {
    // Query the blockchain for transaction history for the specified address
    const response = await thorClient.transactions.getTransactions({
      range: {
        unit: 'block',
        from: 0,
        to: (await thorClient.blocks.getBestBlock()).number,
      },
      criteriaSet: [{
        sender: fromAddress,
      }],
      order: 'desc', // Show newest first
    });

    if (!response || !response.transactions) {
      return buildSuccessResponse(res, []);
    }

    // Filter and format the transactions to only include our notarizations
    const notarizationTxs = response.transactions
      .filter(tx => 
        tx.clauses.length === 1 && // Only one clause
        tx.clauses[0].to.toLowerCase() === fromAddress.toLowerCase() && // Sent to self
        tx.clauses[0].data.length === 66 && // Standard SHA-256 hash length (0x + 64 chars)
        tx.clauses[0].value === '0x0' // No VET transferred
      )
      .map(tx => ({
        id: tx.id,
        hash: tx.clauses[0].data,
        timestamp: tx.blockTimestamp,
        blockNumber: tx.blockNumber,
      }));

    return buildSuccessResponse(res, notarizationTxs);

  } catch (error) {
    console.error("Get Transactions Error:", error);
    return buildErrorResponse(res, 500, 'Internal Server Error', error.message);
  }
}
