import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, canAccessRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !canAccessRole(requiredRole)) {
    // If user can't access this role, redirect them to appropriate dashboard
    return <Navigate to="/supporter/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
