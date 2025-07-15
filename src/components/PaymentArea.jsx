import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripePayment from './StripePayment'
import WalletConnect from './WalletConnect'
import './PaymentArea.css'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51HdSGxxx') // Replace with your actual key

function PaymentArea() {
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [amount, setAmount] = useState(1000) // $10.00 in cents
  const [currency, setCurrency] = useState('usd')
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [wallet, setWallet] = useState(null)

  const paymentOptions = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: '💳', description: 'Pay with Visa, Mastercard, AmEx' },
    { id: 'wallet', name: 'Crypto Wallet', icon: '🦊', description: 'Pay with MetaMask, WalletConnect' }
  ]

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
    setPaymentStatus(null)
  }

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStatus({
      type: 'success',
      message: 'Payment successful!',
      data: paymentData
    })
  }

  const handlePaymentError = (error) => {
    setPaymentStatus({
      type: 'error',
      message: error.message || 'Payment failed. Please try again.',
      data: error
    })
  }

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(cents / 100)
  }

  return (
    <div className="payment-area">
      <div className="payment-header">
        <h2>💰 Payment & Wallet Connect</h2>
        <div className="payment-amount">
          <label>Amount:</label>
          <input
            type="number"
            value={amount / 100}
            onChange={(e) => setAmount(Math.round(e.target.value * 100))}
            min="1"
            step="0.01"
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>
          <div className="amount-display">{formatAmount(amount)}</div>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Choose Payment Method</h3>
        <div className="payment-options">
          {paymentOptions.map(option => (
            <button
              key={option.id}
              className={`payment-option ${paymentMethod === option.id ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange(option.id)}
            >
              <div className="option-icon">{option.icon}</div>
              <div className="option-info">
                <div className="option-name">{option.name}</div>
                <div className="option-description">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {paymentStatus && (
        <div className={`payment-status ${paymentStatus.type}`}>
          <div className="status-icon">
            {paymentStatus.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="status-message">{paymentStatus.message}</div>
          {paymentStatus.data && (
            <div className="status-details">
              <pre>{JSON.stringify(paymentStatus.data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      <div className="payment-content">
        {paymentMethod === 'stripe' && (
          <Elements stripe={stripePromise}>
            <StripePayment
              amount={amount}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}

        {paymentMethod === 'wallet' && (
          <WalletConnect
            amount={amount}
            currency={currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onWalletChange={setWallet}
          />
        )}
      </div>

      {wallet && (
        <div className="wallet-info">
          <h4>🔗 Connected Wallet</h4>
          <div className="wallet-details">
            <div className="wallet-address">
              <strong>Address:</strong> {wallet.address}
            </div>
            <div className="wallet-balance">
              <strong>Balance:</strong> {wallet.balance} ETH
            </div>
            <div className="wallet-network">
              <strong>Network:</strong> {wallet.network}
            </div>
          </div>
        </div>
      )}

      <div className="payment-features">
        <h4>🛡️ Security Features</h4>
        <ul>
          <li>✅ PCI DSS Compliant (Stripe)</li>
          <li>✅ 256-bit SSL Encryption</li>
          <li>✅ Fraud Protection</li>
          <li>✅ Secure Wallet Integration</li>
          <li>✅ Real-time Transaction Monitoring</li>
        </ul>
      </div>
    </div>
  )
}

export default PaymentArea