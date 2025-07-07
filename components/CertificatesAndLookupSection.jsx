import React from 'react';
import { Search } from 'lucide-react';

export default function CertificatesAndLookupSection({
  currentSection,
  typography,
  certificate,
  setCurrentSection,
  categories,
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
        <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
          <Search className="w-6 h-6 text-purple-400" />
          {currentSection === 'certificates' ? 'My Certificates' : 'Verify Proof'}
        </h2>
        {currentSection === 'certificates' ? (
          <div>
            {certificate ? (
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
                <h3 className={`text-white ${typography.title} mb-2`}>{certificate.title}</h3>
                <p className={`text-gray-300 ${typography.base2} mb-2`}>Category: {categories.find(c => c.value === certificate.category)?.label}</p>
                <p className={`text-gray-400 ${typography.caption}`}>Protected: {new Date(certificate.timestamp).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={`text-gray-400 mb-4 ${typography.body}`}>No certificates yet</p>
                <button
                  onClick={() => setCurrentSection('submit')}
                  className={`bg-blue-500 text-white px-6 py-3 rounded-[32px] hover:bg-blue-600 transition-all ${typography.baseM}`}
                >
                  Protect Your First Idea
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className={`block text-gray-300 ${typography.baseM} mb-2`}>Enter Original Content</label>
              <textarea
                placeholder="Re-enter your exact original innovation description..."
                className={`w-full h-32 bg-white/5 border border-white/10 rounded-[32px] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${typography.body}`}
              />
            </div>
            <button className={`w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white ${typography.baseM} py-4 px-6 rounded-[32px] hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}>
              Verify Proof
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
