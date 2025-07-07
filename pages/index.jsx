import Navigation from '../components/Navigation';
import HomeSection from '../components/HomeSection';
import CertificateSection from '../components/CertificateSection';
import CertificatesAndLookupSection from '../components/CertificatesAndLookupSection';
import LanguageDropdown from '../components/LanguageDropdown';
import PatentPlatform from '../components/PatentPlatform';
import SubmitIdeaSection from '../components/SubmitIdeaSection';
import WalletSection from '../components/WalletSection';

export default function Home() {
  return (
    <div>
      <Navigation />
      <HomeSection />
      <CertificateSection />
      <CertificatesAndLookupSection />
      <LanguageDropdown />
      <PatentPlatform />
      <SubmitIdeaSection />
      <WalletSection />
    </div>
  );
}
