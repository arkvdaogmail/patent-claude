import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './StripePayment.css'

function StripePayment({ amount, currency, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError(null)

    try {
      // Create payment intent on server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        }),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Confirm payment with card
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // Add billing details if needed
          },
        },
      })

      if (stripeError) {
        throw stripeError
      }

      // Payment successful
      onSuccess({
        paymentIntent,
        amount: amount,
        currency: currency,
        method: 'stripe'
      })

    } catch (error) {
      console.error('Payment error:', error)
      setCardError(error.message)
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : null)
  }

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(cents / 100)
  }

  return (
    <div className="stripe-payment">
      <div className="payment-header">
        <h3>💳 Credit/Debit Card Payment</h3>
        <div className="payment-amount">
          Total: <strong>{formatAmount(amount)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <label htmlFor="card-element">Card Information</label>
          <CardElement
            id="card-element"
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {cardError && (
          <div className="card-error">
            ❌ {cardError}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="pay-button"
        >
          {isProcessing ? (
            <span className="processing">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : (
            `Pay ${formatAmount(amount)}`
          )}
        </button>
      </form>

      <div className="payment-security">
        <div className="security-badges">
          <span className="badge">🔒 SSL Encrypted</span>
          <span className="badge">✅ PCI Compliant</span>
          <span className="badge">🛡️ Secure</span>
        </div>
        <p className="security-text">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      <div className="accepted-cards">
        <h4>Accepted Cards</h4>
        <div className="card-icons">
          <span className="card-icon">💳</span>
          <span className="card-name">Visa</span>
          <span className="card-icon">💳</span>
          <span className="card-name">Mastercard</span>
          <span className="card-icon">💳</span>
          <span className="card-name">American Express</span>
          <span className="card-icon">💳</span>
          <span className="card-name">Discover</span>
        </div>
      </div>
    </div>
  )
}

export default StripePayment