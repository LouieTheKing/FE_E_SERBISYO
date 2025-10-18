import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";
import { useLoading } from "./components/LoadingContext";
import LoadingSpinner from "./components/Loading";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from './contexts/ChatContext';
import ChatbotWidget from './pages/resident/ChatbotWidget';

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import OfficialManagement from "./pages/admin/official-management/BarangayOfficials";
import ArchivedOfficials from "./pages/admin/official-management/ArchivedOfficials";

import WorkerManagement from "./pages/admin/worker-management/WorkerManagement";
import ArchivedWorkers from "./pages/admin/worker-management/ArchivedWorkers";
import CertificateManagement from "./pages/admin/certificate-management/CertificateManagement";
import CertificateLogs from "./pages/admin/certificate-management/CertificateLogs";
import Blotter from "./pages/admin/Blotter";
import AnnouncementManagement from "./pages/admin/AnnouncementManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import ConfigurationManagement from "./pages/admin/ConfigurationManagement";
import Reports from "./pages/admin/Reports";
import PendingResidents from "./pages/admin/resident-management/PendingResidents";
import RejectedResidents from "./pages/admin/resident-management/RejectedResidents";

import AddResident from "./pages/admin/resident-management/AddResident";

// Worker Pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import RequestManagement from "./pages/worker/RequestManagement";
import WorkerCertificateLogs from "./pages/worker/WorkerCertificateLogs";

// Resident Pages
import ResidentFeedback from "./pages/resident/ResidentFeedback";
import ViewCertificateRequest from "./pages/resident/ViewCertificateRequest";
import CertificateRequestLogs from "./pages/resident/CertificateRequestLogs";
import AvailableCertificates from "./pages/resident/AvailableCertificates";
import MyRequests from "./pages/resident/MyRequests";
import MyCases from "./pages/resident/MyCases";
import ResidentDashboard from "./pages/resident/ResidentDashboard";

// All user type Pages
import MyProfile from "./pages/Profile/MyProfile";
import AllResidents from "./pages/admin/resident-management/AllResidents";

import TrackDocument from "./pages/TrackDocument";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { loading } = useLoading();

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          {loading && <LoadingSpinner />}
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track-document" element={<TrackDocument />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Official Management */}
              <Route
                path="/admin/official-management/officials"
                element={<OfficialManagement />}
              />
              <Route
                path="/admin/official-management/archived"
                element={<ArchivedOfficials />}
              />

              
              {/* Worker Management */}
              <Route path="/admin/workers" element={<WorkerManagement />} />
              <Route path="/admin/workers/add" element={<WorkerManagement />} />
              <Route path="/admin/workers/archived" element={<ArchivedWorkers />} />
              {/* Residence Management */}
              <Route
                path="/admin/resident-management/new"
                element={<AddResident />}
              />
              <Route
                path="/admin/resident-management/all-resident"
                element={<AllResidents />}
              />

              <Route
                path="/admin/resident-management/pending"
                element={<PendingResidents />}
              />
              <Route
                path="/admin/resident-management/rejected"
                element={<RejectedResidents />}
              />
              {/* Certificate Management */}
              <Route
                path="/admin/certificates"
                element={<CertificateManagement />}
              />
              <Route
                path="/admin/certificates/add"
                element={<CertificateManagement />}
              />
              <Route
                path="/admin/certificates/logs"
                element={<CertificateLogs />}
              />
              <Route path="/admin/blotter" element={<Blotter />} />
              <Route
                path="/admin/announcements"
                element={<AnnouncementManagement />}
              />
              <Route path="/admin/feedback" element={<FeedbackManagement />} />
              <Route path="/admin/configurations" element={<ConfigurationManagement />} />
              <Route path="/admin/activity-logs" element={<ActivityLogs />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/profile" element={<MyProfile />} />

              {/* Worker Routes */}
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              {/* Request Management */}
              <Route path="/worker/requests" element={<RequestManagement />} />
              <Route
                path="/worker/certificates/logs"
                element={<WorkerCertificateLogs />}
              />
              {/* Residence Management */}
              <Route path="/worker/resident-management/new" element={<AddResident />} />
              <Route path="/worker/resident-management/pending" element={<PendingResidents />} />
             <Route
                path="/worker/resident-management/all-resident"
                element={<AllResidents />}
              />
              {/* Blotter Management */}
              <Route path="/worker/blotter/new" element={<Blotter />} />
              <Route path="/worker/blotter" element={<Blotter />} />
              <Route path="/worker/profile" element={<MyProfile />} />

              {/* Resident Routes */}
              
              {/* Certificates */}
              <Route
                path="/resident/certificates/available-certificates"
                element={<AvailableCertificates />}
              />
              <Route
                path="/resident/certificates/my-requests"
                element={<MyRequests />}
              />
              <Route
                path="/resident/certificates/view/:requestId"
                element={<ViewCertificateRequest />}
              />
              {/* <Route
                path="/resident/certificates"
                element={<ResidentCertificates />}
              /> */}
              {/* <Route
                path="/resident/certificates/request"
                element={<ResidentCertificates />}
              /> */}
              
              <Route path="/resident/feedback" element={<ResidentFeedback />} />
              <Route path="/resident/profile" element={<MyProfile />} />
              <Route
                path="/resident/certificates/logs"
                element={<CertificateRequestLogs />}
              />
              
              <Route path="/resident/blotter/my-cases" element={<MyCases />} />
              <Route path="/resident/dashboard" element={<ResidentDashboard />} />
            </Route>
          </Routes>
          {/* Only show ChatbotWidget on resident routes */}
          {window.location.pathname.includes('/resident') && (
            <ChatProvider>
              <ChatbotWidget />
            </ChatProvider>
          )}
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
