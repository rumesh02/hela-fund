import { Bell, User, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* App Name */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">Hela Fund</h1>
          <span className="hidden md:inline-block text-sm text-gray-500 border-l pl-4">
            Supporter Portal
          </span>
        </div>

        {/* Right Side - Notifications & User Info */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">Amantha Sandeepa</p>
              <p className="text-xs text-gray-500">Trust Score: 4.8/5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
          </div>

          {/* Logout Button */}
          <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
