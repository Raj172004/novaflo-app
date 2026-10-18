import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyCta } from '@/components/layout/StickyCta';
import { HomePage } from '@/pages/HomePage';
import { ServicesPage, ServiceDetailPage } from '@/pages/ServicesPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { IndustriesPage } from '@/pages/IndustriesPage';
import { InsightsPage, InsightDetailPage } from '@/pages/InsightsPages';
import { BusinessOwnersPage } from '@/pages/BusinessOwnersPage';
import { FaqsPage } from '@/pages/FaqsPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { GrowthCallPage } from '@/pages/GrowthCallPage';
import { PrivacyPolicyPage, TermsPage, DisclaimerPage } from '@/pages/LegalPages';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminContentPage } from '@/pages/admin/AdminContentPage';
import { RequireAdminSession } from '@/components/admin/RequireAdminSession';

export default function App() {
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdminSession>
                <AdminDashboardPage />
              </RequireAdminSession>
            }
          />
          <Route
            path="/admin/content"
            element={
              <RequireAdminSession>
                <AdminContentPage />
              </RequireAdminSession>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/faqs" element={<FaqsPage />} />
              <Route path="/growth-call" element={<GrowthCallPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/business-owners" element={<BusinessOwnersPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
          <StickyCta />
        </div>
      )}
    </BrowserRouter>
  );
}
