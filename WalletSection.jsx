import React from 'react';
import { Wallet } from 'lucide-react';

export default function WalletSection({
  typography,
  wallets,
  walletConnected,
  isProcessing,
  handleWalletConnect,
  selectedCategory,
  ideaDescription,
  categories,
  handleSecureProof,
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
        <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
          <Wallet className="w-6 h-6 text-green-400" />
          Secure Your Protection
        </h2>
        {!walletConnected ? (
          <div>
            <p className={`text-gray-300 mb-6 ${typography.body}`}>Choose your wallet to securely verify your identity:</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  disabled={isProcessing}
                  className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-[32px] px-6 py-4 text-white hover:bg-white/10 transition-all disabled:opacity-50 ${typography.baseM}`}
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <span>{wallet.name}</span>
                </button>
              ))}
            </div>
            {isProcessing && (
              <div className="text-center">
                <p className={`text-blue-300 ${typography.body}`}>Establishing secure link... (takes &lt;10 seconds)</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-[32px] p-4 mb-6">
              <p className={`text-green-300 ${typography.body}`}>Wallet connected successfully!</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-6">
              <h3 className={`text-white ${typography.title} mb-4`}>Protection Summary</h3>
              <div className={`space-y-2 text-gray-300 ${typography.body}`}>
                <p><strong>Category:</strong> {categories.find(c => c.value === selectedCategory)?.label}</p>
                <p><strong>Description:</strong> {ideaDescription.slice(0, 100)}...</p>
                <p><strong>Total Cost:</strong> $15 - all fees included</p>
              </div>
            </div>
            <button
              onClick={handleSecureProof}
              disabled={isProcessing}
              className={`w-full bg-gradient-to-r from-green-500 to-teal-600 text-white ${typography.baseM} py-4 px-6 rounded-[32px] hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50`}
            >
              {isProcessing ? 'Creating unforgeable blockchain proof...' : 'Secure My Proof ($15)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
