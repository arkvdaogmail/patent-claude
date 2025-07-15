// api/storeProof.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { vechainHash, shaHash, timestamp, address, description, category } = req.body;

  if (!vechainHash || !shaHash || !timestamp || !address || !description || !category) {
    return res.status(400).json({ error: 'Missing required fields for proof storage' });
  }

  try {
    const { data, error } = await supabase
      .from('proofs') // Your table name
      .insert([
        { 
          wallet_address: address,
          sha_hash: shaHash,
          vechain_txid: vechainHash,
          timestamp: timestamp,
          description: description,
          category: category
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to store proof in database', details: error.message });
    }

    return res.status(200).json({ message: 'Proof stored successfully', data });

  } catch (e) {
    console.error('Error storing proof:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
}
