import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/requester/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/requester/create-request', icon: Plus, label: 'Create Request' },
    { path: '/requester/my-requests', icon: FileText, label: 'My Requests' },
    { path: '/requester/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/requester/profile', icon: User, label: 'Profile' },
    { path: '/requester/settings', icon: Settings, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white shadow-xl transform transition-all duration-300 ease-in-out border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-5 border-b border-gray-200 bg-white relative">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                <img src="/images/logoCircle.png" alt="Hela Fund Logo" className="w-8 h-8" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Hela Fund</h1>
                  <p className="text-xs text-blue-600 font-medium">Requester Portal</p>
                </div>
              )}
            </div>
            
            {/* Collapse Button - Desktop Only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-md'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                    title={isCollapsed ? item.label : ''}
                  >
                    <item.icon size={20} strokeWidth={2.5} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 font-semibold ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut size={20} strokeWidth={2.5} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
