import Stripe from 'stripe';

// --- Start of a more robust debugging setup ---

let stripe;
let initializationError = null;

// This block will try to initialize Stripe and catch any errors immediately.
try {
  // 1. Check if the environment variable exists.
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set.');
  }

  // 2. Try to create the Stripe object.
  stripe = new Stripe(stripeKey);

} catch (err) {
  // If anything goes wrong above, we store the error.
  console.error('Failed to initialize Stripe:', err);
  initializationError = err;
}

// --- End of robust debugging setup ---


export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- New check: Immediately stop if Stripe failed to initialize ---
  if (initializationError) {
    return res.status(500).json({ 
      error: 'Stripe initialization failed.', 
      details: initializationError.message 
    });
  }
  // --- End of new check ---

  try {
    const amount = 3000; // $30.00

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Error during PaymentIntent creation:', err);
    res.status(500).json({
      error: 'An error occurred with the Stripe API.',
      details: err.message,
    });
  }
}
