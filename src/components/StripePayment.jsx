import { useState } from 'react'

// Simplified StripePayment component that doesn't crash
function StripePayment({ amount, currency, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      if (onSuccess) {
        onSuccess({ 
          id: 'demo_payment_' + Date.now(),
          amount: amount || 1000,
          currency: currency || 'usd',
          status: 'succeeded'
        })
      }
    }, 2000)
  }

  return (
    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            💳 Card Element (Demo Mode)
          </div>
        </div>
        
        {cardError && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            {cardError}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isProcessing}
          style={{
            padding: '12px 24px',
            backgroundColor: isProcessing ? '#ccc' : '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Processing...' : `Pay $${(amount || 1000) / 100}`}
        </button>
      </form>
    </div>
  )
}

export default StripePayment

