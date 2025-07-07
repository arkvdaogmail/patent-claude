import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageDropdown({ showLanguages, setShowLanguages, typography }) {
  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          className={`flex items-center gap-2 bg-black/20 backdrop-blur-lg border border-white/10 rounded-[32px] px-4 py-3 text-white hover:bg-white/10 transition-all ${typography.base2}`}
        >
          <Globe className="w-4 h-4" />
          <span>English</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showLanguages ? 'rotate-180' : ''}`} />
        </button>
        {showLanguages && (
          <div className="absolute top-full right-0 mt-2 bg-black/40 backdrop-blur-lg border border-white/10 rounded-[32px] overflow-hidden">
            <div className="py-2">
              <div className={`px-4 py-2 text-white hover:bg-white/10 cursor-pointer ${typography.base2}`}>English</div>
              <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Spanish (Coming Soon)</div>
              <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Chinese (Coming Soon)</div>
              <div className={`px-4 py-2 text-gray-400 cursor-not-allowed ${typography.base2}`}>Japanese (Coming Soon)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
