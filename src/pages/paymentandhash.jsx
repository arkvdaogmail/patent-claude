import { useState } from 'react';
import PaymentArea from '../components/PaymentArea';
import UploadAfterPayment from '../components/UploadAfterPayment';

export default function PaymentAndHash({ userId }) {
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  return (
    <div>
      {!paymentIntentId
        ? <PaymentArea onPaymentSuccess={data => setPaymentIntentId(data.paymentIntent.id)} />
        : <UploadAfterPayment paymentIntentId={paymentIntentId} userId={userId} />
      }
    </div>
  );
}
