import { Link } from 'react-router-dom';
import { Users, HandHeart } from 'lucide-react';

/**
 * RoleSwitcher Component
 * 
 * This is a development-only component to help switch between
 * Requester and Supporter dashboards during testing.
 * 
 * In production, remove this component as role selection
 * should be handled by authentication/onboarding flow.
 */
const RoleSwitcher = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-600 mb-3 text-center">
          Switch Role (Dev Only)
        </p>
        <div className="flex space-x-2">
          <Link
            to="/requester/dashboard"
            className="flex flex-col items-center space-y-1 px-4 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition"
          >
            <Users size={24} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Requester</span>
          </Link>
          <Link
            to="/supporter/dashboard"
            className="flex flex-col items-center space-y-1 px-4 py-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition"
          >
            <HandHeart size={24} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">Supporter</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;
