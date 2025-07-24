// In file: /api/create-payment-intent.js

import Stripe from 'stripe';

// Make sure your STRIPE_SECRET_KEY is set in your Vercel environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { description } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // Amount in cents ($1.00)
      currency: 'usd',
      description: description || 'Document Notarization Service',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the clientSecret back to the client
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Stripe Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
