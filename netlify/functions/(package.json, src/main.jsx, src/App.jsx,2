import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import SupportPage from '@/pages/SupportPage';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-creamy-white text-text-dark">
      <ScrollToTop />
      <Navigation />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
