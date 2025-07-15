// api/getProofs.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { walletAddress, shaHash, vechainTxid } = req.query; // Get parameters from query string

  try {
    let query = supabase.from('proofs').select('*');

    if (walletAddress) {
      query = query.eq('wallet_address', walletAddress); // Filter by wallet address for "My Certificates"
    }
    if (shaHash) {
      query = query.eq('sha_hash', shaHash); // Filter by SHA hash for "Verify Proof"
    }
    if (vechainTxid) {
      query = query.eq('vechain_txid', vechainTxid); // Filter by VeChain Tx ID for "Verify Proof"
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: 'Failed to retrieve proofs', details: error.message });
    }

    return res.status(200).json({ data });

  } catch (e) {
    console.error('Error retrieving proofs:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
}
