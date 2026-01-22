import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b-2 border-blue-100 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests, messages..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button className="relative p-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md">
            <Bell size={24} strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Rumesh Elpitiya</p>
              <p className="text-xs text-blue-600 font-medium">Requester</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-100">
              RE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
