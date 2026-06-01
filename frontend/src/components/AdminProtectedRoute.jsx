import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { adminUser, loading } = useAuth();

  if (loading) return null;

  if (!adminUser) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
