import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay to Notarize'}
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
