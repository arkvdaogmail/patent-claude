import FileUpload from './components/FileUpload';
import PaymentArea from './components/PaymentArea';
import StripePayment from './components/StripePayment';
import WalletConnect from './components/WalletConnect';
import UploadAfterPayment from './components/uploadafterpayment';

export default function App() {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Patent Claude Full Stack Demo</h1>
      <section>
        <h2>File Upload</h2>
        <FileUpload />
      </section>
      <section>
        <h2>Payment Area</h2>
        <PaymentArea />
      </section>
      <section>
        <h2>Stripe Payment</h2>
        <StripePayment />
      </section>
      <section>
        <h2>Wallet Connect</h2>
        <WalletConnect />
      </section>
      <section>
        <h2>Upload After Payment</h2>
        <UploadAfterPayment />
      </section>
    </div>
  );
}
