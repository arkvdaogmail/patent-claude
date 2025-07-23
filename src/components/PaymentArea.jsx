import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from './StripePayment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentArea({ onPaymentSuccess }) {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStatus({ type: 'success', message: 'Payment successful!', data: paymentData });
    onPaymentSuccess(paymentData);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus({ type: 'error', message: error.message || 'Payment failed. Please try again.' });
  };

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
