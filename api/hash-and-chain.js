import formidable from 'formidable';
import fs from 'fs';
import { createHash } from 'crypto';
import Stripe from 'stripe';
import { Connex } from '@vechain/connex';
import { simpleWallet } from '@vechain/connex-framework';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const isProd = process.env.NODE_ENV === "production";
const explorerUrlBase = isProd
  ? "https://explore.vechain.org/transactions/"
  : "https://explore-testnet.vechain.org/transactions/";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Form parse error' });
    const file = files.document;
    const paymentIntentId = fields.paymentIntentId;
    const userId = fields.userId || null;

    // 1. Verify Stripe Payment
    let intent;
    try {
      intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== 'succeeded') throw new Error('Payment not completed');
    } catch (e) {
      return res.status(400).json({ error: 'Invalid or incomplete payment' });
    }

    // 2. Hash document
    const buffer = fs.readFileSync(file.filepath);
    const hash = createHash('sha256').update(buffer).digest('hex');

    // 3. Send hash to Vechain
    const connex = new Connex({ node: process.env.VECHAIN_NODE_URL, network: isProd ? 'main' : 'test' });
    const wallet = simpleWallet();
    wallet.import(process.env.VECHAIN_PRIVATE_KEY);
    const clause = { to: wallet.list()[0].address, value: '0', data: '0x' + hash };
    let tx;
    try {
      tx = await connex.vendor.sign('tx', [clause]).signer(wallet.list()[0].address).request();
    } catch (e) {
      return res.status(500).json({ error: 'Vechain error: ' + e.message });
    }

    // 4. Store in Supabase
    try {
      const { error } = await supabase.from('documents').insert([{
        user_id: userId,
        file_name: file.originalFilename,
        file_size: file.size,
        sha256: hash,
        vechain_tx: tx.txid,
        vechain_url: explorerUrlBase + tx.txid,
        payment_intent: paymentIntentId,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
    } catch (e) {
      // Even if Supabase fails, return hash/tx so user is not blocked
      console.error('Supabase error:', e.message);
    }

    res.status(200).json({
      hash,
      txid: tx.txid,
      explorerUrl: explorerUrlBase + tx.txid
    });
  });
}
