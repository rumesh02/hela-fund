import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Landing Page
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Requester Imports
import RequesterLayout from './layouts/RequesterLayout';
import RequesterDashboard from './pages/Requester/Dashboard';
import CreateRequest from './pages/Requester/CreateRequest';
import MyRequests from './pages/Requester/MyRequests';
import RequesterMessages from './pages/Requester/Messages';
import RequesterProfile from './pages/Requester/Profile';
import RequesterSettings from './pages/Requester/Settings';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ViewUsers from './pages/Admin/ViewUsers';
import VerifyRequests from './pages/Admin/VerifyRequests';

// Supporter Imports
import SupporterLayout from './layouts/SupporterLayout';
import SupporterDashboard from './pages/Supporter/Dashboard';
import BrowseRequests from './pages/Supporter/BrowseRequests';
import MyContributions from './pages/Supporter/MyContributions';
import SupporterMessages from './pages/Supporter/Messages';
import SupporterProfile from './pages/Supporter/Profile';
import SupporterSettings from './pages/Supporter/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Requester Routes */}
        <Route path="/requester" element={
          <ProtectedRoute requiredRole="requester">
            <RequesterLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/requester/dashboard" replace />} />
          <Route path="dashboard" element={<RequesterDashboard />} />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="messages" element={<RequesterMessages />} />
          <Route path="profile" element={<RequesterProfile />} />
          <Route path="settings" element={<RequesterSettings />} />
        </Route>

        {/* Supporter Routes */}
        <Route path="/supporter" element={
          <ProtectedRoute requiredRole="supporter">
            <SupporterLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/supporter/dashboard" replace />} />
          <Route path="dashboard" element={<SupporterDashboard />} />
          <Route path="browse-requests" element={<BrowseRequests />} />
          <Route path="my-contributions" element={<MyContributions />} />
          <Route path="messages" element={<SupporterMessages />} />
          <Route path="profile" element={<SupporterProfile />} />
          <Route path="settings" element={<SupporterSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="verify-requests" element={<VerifyRequests />} />
        </Route>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
