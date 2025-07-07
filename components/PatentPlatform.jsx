import React, { useState } from 'react';
import LanguageDropdown from './LanguageDropdown';
import Navigation from './Navigation';
import HomeSection from './HomeSection';
import SubmitIdeaSection from './SubmitIdeaSection';
import WalletSection from './WalletSection';
import CertificateSection from './CertificateSection';
import CertificatesAndLookupSection from './CertificatesAndLookupSection';

export default function PatentPlatform() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [showLanguages, setShowLanguages] = useState(false);

  const typography = {}; // Move your typography object here
  const categories = []; // Move your categories array here
  const wallets = []; // Move your wallets array here

  const handleSubmitIdea = () => {}; // Move your function here
  const handleWalletConnect = (walletId) => {};
  const handleSecureProof = () => {};

  return (
    <div className="min-h-screen font-['Rubik'] bg-[#191919]" style={{ backgroundColor: '#191919' }}>
      <LanguageDropdown showLanguages={showLanguages} setShowLanguages={setShowLanguages} typography={typography} />
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} typography={typography} />
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {currentSection === 'home' && <HomeSection typography={typography} setCurrentSection={setCurrentSection} />}
        {currentSection === 'submit' && (
          <SubmitIdeaSection
            typography={typography}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            ideaDescription={ideaDescription}
            setIdeaDescription={setIdeaDescription}
            handleSubmitIdea={handleSubmitIdea}
          />
        )}
        {currentSection === 'wallet' && (
          <WalletSection
            typography={typography}
            wallets={wallets}
            walletConnected={walletConnected}
            isProcessing={isProcessing}
            handleWalletConnect={handleWalletConnect}
            selectedCategory={selectedCategory}
            ideaDescription={ideaDescription}
            categories={categories}
            handleSecureProof={handleSecureProof}
          />
        )}
        {currentSection === 'certificate' && certificate && (
          <CertificateSection
            typography={typography}
            certificate={certificate}
            setCurrentSection={setCurrentSection}
          />
        )}
        {(currentSection === 'certificates' || currentSection === 'verify') && (
          <CertificatesAndLookupSection
            currentSection={currentSection}
            typography={typography}
            certificate={certificate}
            setCurrentSection={setCurrentSection}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
