import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from './StripePayment';

// Fix: Check if Stripe key exists, otherwise use null
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function PaymentArea({ onPaymentSuccess }) {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStatus({ type: 'success', message: 'Payment successful!', data: paymentData });
    if (onPaymentSuccess) onPaymentSuccess(paymentData);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus({ type: 'error', message: error.message || 'Payment failed. Please try again.' });
  };

  // If no Stripe key, show message instead of crashing
  if (!stripeKey) {
    return (
      <div className="payment-area">
        <h2>💰 Payment</h2>
        <div style={{ padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <p>⚠️ Stripe configuration missing. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-area">
      <h2>💰 Payment</h2>
      <Elements stripe={stripePromise}>
        <StripePayment onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
      </Elements>
      {paymentStatus && (
        <div className={`payment-status ${paymentStatus.type}`}>
          <div className="status-icon">
            {paymentStatus.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="status-message">{paymentStatus.message}</div>
        </div>
      )}
    </div>
  );
}
