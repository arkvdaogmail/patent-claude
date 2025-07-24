import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { txId } = req.query;

  if (!txId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Query the database for the transaction
    const { data, error } = await supabase
      .from(process.env.SUPABASE_TABLE)
      .select('*')
      .eq('tx_id', txId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return res.status(404).json({ 
          error: 'Document not found. Please check your transaction ID.' 
        });
      }
      throw error;
    }

    // Return the found record
    res.status(200).json(data);

  } catch (error) {
    console.error('Lookup Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while looking up the document.' 
    });
  }
}

