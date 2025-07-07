import React from 'react';

export default function Navigation({ currentSection, setCurrentSection, typography }) {
  return (
    <nav className="relative z-40 p-6">
      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="flex bg-black/20 rounded-[32px] p-1 backdrop-blur-lg border border-white/10">
          {['home', 'submit', 'certificates', 'verify'].map(section => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`px-6 py-3 rounded-[32px] transition-all ${typography.baseM} ${
                currentSection === section
                  ? section === 'certificates'
                    ? 'bg-green-500 text-white'
                    : section === 'verify'
                      ? 'bg-purple-500 text-white'
                      : 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {section === 'home' && 'Home'}
              {section === 'submit' && 'Protect Idea'}
              {section === 'certificates' && 'My Certificates'}
              {section === 'verify' && 'Verify Proof'}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
