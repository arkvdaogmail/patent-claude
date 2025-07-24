const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'usd', paymentMethod } = req.body;
      
      if (!amount || amount < 50) {
        return res.status(400).json({ 
          error: 'Amount must be at least $0.50' 
        });
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethod,
        confirm: paymentMethod ? true : false,
        return_url: `${req.headers.origin}/payment-success`,
        metadata: {
          integration_check: 'accept_a_payment',
        },
      });
      
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ 
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}