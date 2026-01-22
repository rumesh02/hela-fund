import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const displayName = user?.name || user?.fullName || 'User';
  const initials = getInitials(displayName);

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b-2 border-blue-100 sticky top-0 z-20">
      <div className="flex items-center justify-end px-6 py-4">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md">
            <Bell size={24} strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-blue-600 font-medium">Requester</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-100">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
