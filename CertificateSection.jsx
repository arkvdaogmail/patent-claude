import React from 'react';
import { CheckCircle, Copy, Download } from 'lucide-react';

export default function CertificateSection({ typography, certificate, setCurrentSection }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
        <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
          <CheckCircle className="w-6 h-6 text-green-400" />
          Your Idea is Protected!
        </h2>
        <div className="bg-green-500/10 border border-green-500/30 rounded-[32px] p-6 mb-6">
          <p className={`text-green-300 ${typography.body} mb-4`}>
            Congratulations! Your innovation has been timestamped on the blockchain with unforgeable proof.
          </p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
            <div className="flex items-center justify-between">
              <span className={`text-gray-300 ${typography.baseM}`}>VeChain Hash ID:</span>
              <button className="text-blue-400 hover:text-blue-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-white font-mono ${typography.base2} mt-1`}>{certificate.vechainHash}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
            <div className="flex items-center justify-between">
              <span className={`text-gray-300 ${typography.baseM}`}>SHA-Hash ID:</span>
              <button className="text-blue-400 hover:text-blue-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-white font-mono ${typography.base2} mt-1`}>{certificate.shaHash}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-4">
            <span className={`text-gray-300 ${typography.baseM}`}>Timestamp:</span>
            <p className={`text-white ${typography.base2} mt-1`}>{new Date(certificate.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className={`flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-[32px] hover:bg-blue-600 transition-all ${typography.baseM}`}>
            <Download className="w-4 h-4" /> Download Certificate
          </button>
          <button
            onClick={() => setCurrentSection('certificates')}
            className={`bg-white/10 text-white px-6 py-3 rounded-[32px] hover:bg-white/20 transition-all ${typography.baseM}`}
          >
            View My Certificates
          </button>
        </div>
      </div>
    </div>
  );
}
