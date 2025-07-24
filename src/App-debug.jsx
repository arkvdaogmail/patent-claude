import FileUpload from './components/FileUpload';
import PaymentArea from './components/PaymentArea';

export default function App() {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Patent Claude Full Stack Demo - DEBUG</h1>
      <section>
        <h2>File Upload</h2>
        <FileUpload />
      </section>
      <section>
        <h2>Payment Area</h2>
        <PaymentArea />
      </section>
    </div>
  );
}

