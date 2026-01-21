import { Link, useNavigate } from 'react-router-dom';
import { Users, HandHeart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * RoleSwitcher Component
 * 
 * Allows university students (requesters) to switch between
 * Requester and Supporter roles.
 * Only visible for users with student account type.
 */
const RoleSwitcher = () => {
  const { user, switchRole, canAccessRole, isStudent } = useAuth();
  const navigate = useNavigate();

  // Only show for students who can access both roles
  if (!isStudent) {
    return null;
  }

  const handleRoleSwitch = (newRole, path) => {
    switchRole(newRole);
    navigate(path);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-600 mb-3 text-center">
          Switch Role
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleRoleSwitch('requester', '/requester/dashboard')}
            className={`flex flex-col items-center space-y-1 px-4 py-3 border-2 rounded-lg transition ${
              user?.role === 'requester'
                ? 'bg-blue-100 border-blue-500'
                : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
            }`}
          >
            <Users size={24} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Requester</span>
          </button>
          <button
            onClick={() => handleRoleSwitch('supporter', '/supporter/dashboard')}
            className={`flex flex-col items-center space-y-1 px-4 py-3 border-2 rounded-lg transition ${
              user?.role === 'supporter'
                ? 'bg-green-100 border-green-500'
                : 'bg-green-50 hover:bg-green-100 border-green-200'
            }`}
          >
            <HandHeart size={24} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Supporter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
