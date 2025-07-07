import React from 'react';
import { Hash, Bot, Globe } from 'lucide-react';

export default function SubmitIdeaSection({
  typography,
  categories,
  selectedCategory,
  setSelectedCategory,
  ideaDescription,
  setIdeaDescription,
  handleSubmitIdea,
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black/20 backdrop-blur-lg rounded-[32px] border border-white/10 p-8">
        <h2 className={`${typography.title} text-white mb-6 flex items-center gap-2`}>
          <Hash className="w-6 h-6 text-blue-400" />
          Protect Your Innovation
        </h2>
        <div className="flex gap-4 mb-6">
          <button className={`flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-[32px] px-4 py-2 text-yellow-300 cursor-not-allowed ${typography.base2}`}>
            <Bot className="w-4 h-4" /> AI Expert Help - Coming Soon
          </button>
          <button className={`flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-[32px] px-4 py-2 text-purple-300 cursor-not-allowed ${typography.base2}`}>
            <Globe className="w-4 h-4" /> Languages - Coming Soon
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <label className={`block text-gray-300 ${typography.baseM} mb-2`}>Innovation Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full bg-white/5 border border-white/10 rounded-[32px] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${typography.body}`}
            >
              <option value="">Select your innovation type...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#303030]">{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-gray-300 ${typography.baseM} mb-2`}>Describe Your Innovation</label>
            <textarea
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Describe your idea in detail. Your content stays private during scanning..."
              className={`w-full h-32 bg-white/5 border border-white/10 rounded-[32px] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${typography.body}`}
            />
            <p className={`${typography.caption} text-gray-400 mt-2`}>
              We create cryptographic proof of creation date. Not a patent, but solid proof your idea came first.
            </p>
          </div>
          <button
            onClick={handleSubmitIdea}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white ${typography.baseM} py-4 px-6 rounded-[32px] hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
          >
            Start Protection Process
          </button>
        </div>
      </div>
    </div>
  );
}
