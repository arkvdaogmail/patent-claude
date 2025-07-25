import Stripe from 'stripe';

// Initialize Stripe with the secret key from your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // For now, we will use a fixed amount.
    // Later, this can come from the request body: req.body.amount
    const amount = 3000; // Amount in cents ($30.00)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the clientSecret back to the client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    // This is the corrected, detailed error logging
    console.error('A critical error occurred in the Stripe API call:', err);
    
    // Send a detailed error response back to the client for debugging
    res.status(500).json({
      error: {
        message: 'An internal server error occurred.',
        details: err.message, // Provide the specific message from the error
      }
    });
  }
}
