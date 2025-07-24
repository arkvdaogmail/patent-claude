// In file: src/components/StripePayment.jsx

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// --- IMPORTANT: Use your VITE_STRIPE_PUBLISHABLE_KEY from your .env file ---
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onPaymentSuccess, fileName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      setProcessing(false);
      return;
    }

    // Step 1: Create a Payment Intent on your server
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: `Notarization for ${fileName}` }),
    });
    const { clientSecret, error: backendError } = await res.json();

    if (backendError) {
      setError(backendError);
      setProcessing(false);
      return;
    }

    // Step 2: Confirm the payment on the client
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // --- This is the crucial part that connects back to App.jsx ---
      onPaymentSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay $1.00'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

const StripePayment = ({ onPaymentSuccess, fileName }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onPaymentSuccess={onPaymentSuccess} fileName={fileName} />
  </Elements>
);

export default StripePayment;
