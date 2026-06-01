import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
