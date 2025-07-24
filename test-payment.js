// Test script for payment functionality
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

async function testPaymentIntent() {
  try {
    console.log('Testing Stripe Payment Intent creation...');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1.00 in cents
      currency: 'usd',
      description: 'Test Document Notarization',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ Payment Intent created successfully');
    console.log('Client Secret:', paymentIntent.client_secret);
    console.log('Payment Intent ID:', paymentIntent.id);
    
    return true;
  } catch (error) {
    console.error('❌ Payment Intent creation failed:');
    console.error('Error:', error.message);
    return false;
  }
}

// Run test
testPaymentIntent().then(success => {
  process.exit(success ? 0 : 1);
});

