import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import WhatIsCoreVideoPage from './pages/WhatIsCoreVideoPage';
import HowToMakeCoreVideoPage from './pages/HowToMakeCoreVideoPage';
import TipsPage from './pages/TipsPage';
import ExamplesPage from './pages/ExamplesPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/what-is-a-core-video" element={<WhatIsCoreVideoPage />} />
          <Route path="/how-to-make-a-core-video" element={<HowToMakeCoreVideoPage />} />
          <Route path="/tips-for-short-form-video" element={<TipsPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
