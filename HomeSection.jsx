import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function HomeSection({ typography, setCurrentSection }) {
  return (
    <div className="text-center">
      {/* Hero */}
      <div className="mb-12">
        <h1 className={`${typography.headline} text-white mb-6`} style={{ fontSize: '48px' }}>
          Turn Your Ideas Into Unforgeable Proof
        </h1>
        <p className={`${typography.title} text-gray-300 mb-8`}>
          Blockchain-certified timestamps accepted globally. Court-admissible proof of creation in minutes, not years.
        </p>
        <button
          onClick={() => setCurrentSection('submit')}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white ${typography.baseM} py-4 px-8 rounded-[32px] hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          Start Protecting Your Idea
        </button>
      </div>

      {/* Value Props */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-6">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className={`text-white ${typography.title} mb-2`}>Instant Global Protection</h3>
          <p className={`text-gray-300 ${typography.base2}`}>150+ countries recognize blockchain timestamps</p>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-6">
          <div className="text-3xl mb-4">💎</div>
          <h3 className={`text-white ${typography.title} mb-2`}>Honest Promise</h3>
          <p className={`text-gray-300 ${typography.base2}`}>Not a patent, but solid proof your idea came first</p>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-6">
          <div className="text-3xl mb-4">♾️</div>
          <h3 className={`text-white ${typography.title} mb-2`}>Forever Yours</h3>
          <p className={`text-gray-300 ${typography.base2}`}>Your proof survives even if we don't - that's blockchain</p>
        </div>
        <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-6">
          <div className="text-3xl mb-4">👥</div>
          <h3 className={`text-white ${typography.title} mb-2`}>Creator Friendly</h3>
          <p className={`text-gray-300 ${typography.base2}`}>Join 15,000+ innovators who chose proof over promises</p>
        </div>
      </div>

      {/* Differences */}
      <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
        <h2 className={`${typography.title} text-white mb-6`}>Why We're Different</h2>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className={`text-white ${typography.body}`}>$5-20 total cost (vs $15,000 lawyers)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className={`text-white ${typography.body}`}>Minutes not years (vs 2-4 year patent wait)</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className={`text-white ${typography.body}`}>Global protection (vs single country patents)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className={`text-white ${typography.body}`}>Blockchain permanence (vs paper certificates)</span>
            </div>
          </div>
        </div>
        <p className={`text-gray-300 text-center mt-6 italic ${typography.body}`}>
          "While others promise patent-level protection they can't deliver, we give you exactly what blockchain does best: unforgeable proof of creation that lasts forever."
        </p>
      </div>
    </div>
  );
}
