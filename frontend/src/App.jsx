import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Requester Imports
import RequesterLayout from './layouts/RequesterLayout';
import RequesterDashboard from './pages/Requester/Dashboard';
import CreateRequest from './pages/Requester/CreateRequest';
import MyRequests from './pages/Requester/MyRequests';
import RequesterMessages from './pages/Requester/Messages';
import RequesterProfile from './pages/Requester/Profile';
import RequesterSettings from './pages/Requester/Settings';

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
        {/* Redirect root to requester dashboard 
        <Route path="/" element={<Navigate to="/requester/dashboard" replace />} /> */}
        
        {/* Requester Routes */}
        <Route path="/requester" element={<RequesterLayout />}>
          <Route index element={<Navigate to="/requester/dashboard" replace />} />
          <Route path="dashboard" element={<RequesterDashboard />} />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="messages" element={<RequesterMessages />} />
          <Route path="profile" element={<RequesterProfile />} />
          <Route path="settings" element={<RequesterSettings />} />
        </Route>

        {/* Supporter Routes */}
        <Route path="/supporter" element={<SupporterLayout />}>
          <Route index element={<Navigate to="/supporter/dashboard" replace />} />
          <Route path="dashboard" element={<SupporterDashboard />} />
          <Route path="browse-requests" element={<BrowseRequests />} />
          <Route path="my-contributions" element={<MyContributions />} />
          <Route path="messages" element={<SupporterMessages />} />
          <Route path="profile" element={<SupporterProfile />} />
          <Route path="settings" element={<SupporterSettings />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/requester/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
