import { Eye, Edit, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';

const MyRequests = () => {
  const [filter, setFilter] = useState('all');

  const requests = [
    {
      id: 1,
      title: 'Lost Student ID Card',
      category: 'Lost Item',
      status: 'Pending',
      urgency: 'High',
      date: '2025-11-04',
      supporters: 3,
    },
    {
      id: 2,
      title: 'Textbook for Semester',
      category: 'Micro-Funding',
      status: 'Completed',
      urgency: 'Medium',
      date: '2025-11-03',
      supporters: 1,
    },
    {
      id: 3,
      title: 'Study Group Formation',
      category: 'Community Help',
      status: 'Pending',
      urgency: 'Low',
      date: '2025-11-02',
      supporters: 5,
    },
    {
      id: 4,
      title: 'Lab Equipment Found',
      category: 'Lost Item',
      status: 'In Progress',
      urgency: 'Medium',
      date: '2025-11-01',
      supporters: 2,
    },
    {
      id: 5,
      title: 'Assignment Help Needed',
      category: 'Community Help',
      status: 'Rejected',
      urgency: 'High',
      date: '2025-10-30',
      supporters: 0,
    },
  ];

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((req) => req.status.toLowerCase() === filter);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-1">View and manage all your submitted requests.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
          + Create New Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Filter size={22} className="text-blue-600" />
          </div>
          {['all', 'pending', 'in progress', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Supporters
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-blue-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{request.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{request.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                        request.urgency === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : request.urgency === 'Medium'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {request.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{request.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{request.supporters}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                        title="View Details"
                      >
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                        title="Edit Request"
                      >
                        <Edit size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        className="p-2.5 text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                        title="Delete Request"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <p className="text-gray-600 text-lg font-medium">No requests found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Total Requests</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{requests.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 hover:shadow-xl transition-all">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {requests.filter((r) => r.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-all">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {requests.filter((r) => r.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Total Supporters</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {requests.reduce((acc, r) => acc + r.supporters, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
