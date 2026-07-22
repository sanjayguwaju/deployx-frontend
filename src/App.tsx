import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/AuthPages/SignIn";
import { AuthProvider } from "./context/AuthContext";
import { FeatureFlagProvider } from "./context/FeatureFlagContext";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PieChart from "./pages/Charts/PieChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/LandingPage";
import MarketingLayout from "./layout/MarketingLayout";
import FeaturesPage from "./pages/Marketing/FeaturesPage";
import HowItWorksPage from "./pages/Marketing/HowItWorksPage";
import PricingPage from "./pages/Marketing/PricingPage";
import DocumentationPage from "./pages/Marketing/DocumentationPage";
import DocumentationArticlePage from "./pages/Marketing/DocumentationArticlePage";
import ApiReferencePage from "./pages/Marketing/ApiReferencePage";
import CommunityPage from "./pages/Marketing/CommunityPage";
import ContactPage from "./pages/Marketing/ContactPage";
import PrivacyPolicyPage from "./pages/Marketing/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/Marketing/TermsOfServicePage";
import RegisterAgency from "./pages/Onboarding/RegisterAgency";
import Users from "./pages/Users/Users";
import Roles from "./pages/Users/Roles";
import Notifications from "./pages/Notifications/Notifications";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuditLogs from "./pages/AuditLogs/AuditLogs";
import PipelineBoard from "./pages/Pipeline/PipelineBoard";
import SmartDocumentParser from "./pages/Tools/SmartDocumentParser";
import AgentDashboard from "./pages/AgentPortal/AgentDashboard";
import AgentCandidates from "./pages/AgentPortal/AgentCandidates";
import AgentCommissions from "./pages/AgentPortal/AgentCommissions";
import Approvals from "./pages/Approvals/Approvals";
import FeatureFlagsAdmin from "./pages/System/FeatureFlagsAdmin";
import BrandingSettings from "./pages/System/BrandingSettings";
import TenantAdminDashboard from "./pages/System/TenantAdminDashboard";
import SuperAdminDashboard from "./pages/System/SuperAdminDashboard";
import Billing from "./pages/System/Billing";
import BillingVerify from "./pages/System/BillingVerify";
import PlatformBilling from "./pages/System/PlatformBilling";
import WhatsAppIntegration from "./pages/System/WhatsAppIntegration";
import VerifyDocument from "./pages/Public/VerifyDocument";
import SignContract from "./pages/Public/SignContract";
import { SocketProvider } from "./context/SocketContext";
import { TooltipProvider } from "./components/ui/tooltip/Tooltip";

export default function App() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  let subdomain = "";
  if (hostname.includes("localhost") && parts.length > 1) {
    subdomain = parts[0];
  } else if (parts.length > 2) {
    subdomain = parts[0];
  }
  const isNakedDomain = !subdomain || subdomain === "www" || subdomain === "app" || subdomain === "deployx";

  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <FeatureFlagProvider>
          <SocketProvider>
            <TooltipProvider delayDuration={300}>
              <Router>
                <ScrollToTop />
              <Routes>
                {/* Marketing Pages */}
                {isNakedDomain ? (
                  <Route element={<MarketingLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/docs" element={<DocumentationPage />} />
                    <Route path="/docs/:slug" element={<DocumentationArticlePage />} />
                    <Route path="/api-reference" element={<ApiReferencePage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                  </Route>
                ) : (
                  <Route path="/" element={<Navigate to="/signin" replace />} />
                )}
                <Route path="/register" element={<RegisterAgency />} />

                {/* Dashboard Layout */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<ProtectedRoute action="read" subject="dashboard"><Home /></ProtectedRoute>} />

                  {/* Others Page */}
                  <Route path="/profile" element={<ProtectedRoute><UserProfiles /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/blank" element={<ProtectedRoute><Blank /></ProtectedRoute>} />
                  
                  <Route path="/users" element={<ProtectedRoute action="read" subject="users"><Users /></ProtectedRoute>} />
                  <Route path="/roles" element={<ProtectedRoute action="read" subject="rbac"><Roles /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute action="read" subject="notifications"><Notifications /></ProtectedRoute>} />
                  <Route path="/audit-logs" element={<ProtectedRoute action="read" subject="audit_logs"><AuditLogs /></ProtectedRoute>} />
                  <Route path="/demands/:id/pipeline" element={<ProtectedRoute action="read" subject="dashboard"><PipelineBoard /></ProtectedRoute>} />
                  <Route path="/approvals" element={<ProtectedRoute action="read" subject="ApprovableDocument"><Approvals /></ProtectedRoute>} />
                  <Route path="/feature-flags" element={<ProtectedRoute action="manage" subject="FeatureFlag"><FeatureFlagsAdmin /></ProtectedRoute>} />
                  <Route path="/administrator" element={<ProtectedRoute><TenantAdminDashboard /></ProtectedRoute>} />
                  <Route path="/superadmindashboard" element={<ProtectedRoute action="manage" subject="all"><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="/system/tenants" element={<ProtectedRoute action="manage" subject="all"><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="/system/billing-admin" element={<ProtectedRoute action="manage" subject="all"><PlatformBilling /></ProtectedRoute>} />
                  <Route path="/settings/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} />
                  <Route path="/settings/whatsapp" element={<ProtectedRoute><WhatsAppIntegration /></ProtectedRoute>} />

                  {/* Tools */}
                  <Route path="/tools/smart-parser" element={<ProtectedRoute action="read" subject="AI"><SmartDocumentParser /></ProtectedRoute>} />

                  {/* Agent Portal */}
                  <Route path="/agent/dashboard" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
                  <Route path="/agent/candidates" element={<ProtectedRoute><AgentCandidates /></ProtectedRoute>} />
                  <Route path="/agent/commissions" element={<ProtectedRoute><AgentCommissions /></ProtectedRoute>} />

                  {/* Billing Routes */}
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/billing/verify" element={<BillingVerify />} />

                  {/* Settings */}

                  {/* Forms */}
                  <Route path="/form-elements" element={<FormElements />} />

                  {/* Tables */}
                  <Route path="/basic-tables" element={<BasicTables />} />

                  {/* Ui Elements */}
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/avatars" element={<Avatars />} />
                  <Route path="/badge" element={<Badges />} />
                  <Route path="/buttons" element={<Buttons />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/videos" element={<Videos />} />

                  {/* Charts */}
                  <Route path="/line-chart" element={<LineChart />} />
                  <Route path="/bar-chart" element={<BarChart />} />
                  <Route path="/pie-chart" element={<PieChart />} />
                </Route>

                {/* Public Portal */}
                <Route path="/verify/:hash" element={<VerifyDocument />} />
                <Route path="/sign/:id" element={<SignContract />} />

                {/* Auth Layout */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            </TooltipProvider>
          </SocketProvider>
        </FeatureFlagProvider>
      </AuthProvider>
    </>
  );
}
