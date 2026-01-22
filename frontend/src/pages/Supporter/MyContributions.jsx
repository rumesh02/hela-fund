import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MapPin, MessageSquare, Eye } from 'lucide-react';

const MyContributions = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const contributions = [
    {
      id: 1,
      requestTitle: 'Need Laptop for Online Classes',
      requester: 'Kasun Perera',
      university: 'University of Colombo',
      location: 'Colombo',
      category: 'Electronics',
      amount: 'LKR 50,000',
      contributedDate: '2024-11-03',
      status: 'ongoing',
      completionDate: null,
      messages: 5
    },
    {
      id: 2,
      requestTitle: 'Engineering Textbooks Required',
      requester: 'Nimali Silva',
      university: 'University of Peradeniya',
      location: 'Kandy',
      category: 'Books',
      amount: 'LKR 8,000',
      contributedDate: '2024-10-28',
      status: 'completed',
      completionDate: '2024-11-01',
      messages: 8
    },
    {
      id: 3,
      requestTitle: 'Monthly Bus Pass Support',
      requester: 'Amila Fernando',
      university: 'University of Ruhuna',
      location: 'Galle',
      category: 'Transport',
      amount: 'LKR 3,500',
      contributedDate: '2024-11-02',
      status: 'ongoing',
      completionDate: null,
      messages: 3
    },
    {
      id: 4,
      requestTitle: 'Internet Data Package',
      requester: 'Sanduni Rathnayake',
      university: 'University of Jaffna',
      location: 'Jaffna',
      category: 'Electronics',
      amount: 'LKR 2,000',
      contributedDate: '2024-10-25',
      status: 'completed',
      completionDate: '2024-10-26',
      messages: 4
    },
    {
      id: 5,
      requestTitle: 'Medical Supplies for Surgery Recovery',
      requester: 'Ruwan Wickramasinghe',
      university: 'University of Sri Jayewardenepura',
      location: 'Colombo',
      category: 'Medical',
      amount: 'LKR 15,000',
      contributedDate: '2024-11-04',
      status: 'pending',
      completionDate: null,
      messages: 2
    },
    {
      id: 6,
      requestTitle: 'Meal Plan Support',
      requester: 'Nimal Jayasuriya',
      university: 'Wayamba University',
      location: 'Kurunegala',
      category: 'Food',
      amount: 'LKR 5,000',
      contributedDate: '2024-10-20',
      status: 'completed',
      completionDate: '2024-10-22',
      messages: 6
    },
    {
      id: 7,
      requestTitle: 'Printing and Stationery',
      requester: 'Dilani Perera',
      university: 'Sabaragamuwa University',
      location: 'Ratnapura',
      category: 'Other',
      amount: 'LKR 4,000',
      contributedDate: '2024-11-05',
      status: 'pending',
      completionDate: null,
      messages: 1
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Clock },
      ongoing: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircle }
    };
    return styles[status] || styles.pending;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: '💻',
      Books: '📚',
      Transport: '🚌',
      Medical: '⚕️',
      Food: '🍽️',
      Other: '📦'
    };
    return icons[category] || '📦';
  };

  const filteredContributions = contributions.filter(
    (contrib) => selectedStatus === 'all' || contrib.status === selectedStatus
  );

  const stats = {
    total: contributions.length,
    pending: contributions.filter((c) => c.status === 'pending').length,
    ongoing: contributions.filter((c) => c.status === 'ongoing').length,
    completed: contributions.filter((c) => c.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>
        <p className="text-gray-600 mt-1">Track all the requests you've helped with</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Total Contributions</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <p className="text-sm text-blue-700 font-semibold uppercase tracking-wider mb-1">Pending</p>
          <p className="text-4xl font-bold text-blue-800 mt-3">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
          <p className="text-sm text-amber-700 font-semibold uppercase tracking-wider mb-1">Ongoing</p>
          <p className="text-4xl font-bold text-amber-800 mt-3">{stats.ongoing}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wider mb-1">Completed</p>
          <p className="text-4xl font-bold text-emerald-800 mt-3">{stats.completed}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                selectedStatus === status
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Contributions List */}
      <div className="space-y-4">
        {filteredContributions.map((contribution) => {
          const statusStyle = getStatusBadge(contribution.status);
          const StatusIcon = statusStyle.icon;

          return (
            <div
              key={contribution.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Left Section - Request Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-3xl">{getCategoryIcon(contribution.category)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {contribution.requestTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Requester:</span> {contribution.requester}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{contribution.university}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {contribution.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Contributed: {new Date(contribution.contributedDate).toLocaleDateString()}
                      </div>
                      {contribution.completionDate && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={14} className="mr-1" />
                          Completed: {new Date(contribution.completionDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section - Status & Actions */}
                <div className="flex flex-col lg:items-end space-y-3">
                  {/* Amount */}
                  <div className="text-lg font-bold text-teal-600">{contribution.amount}</div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    <StatusIcon size={16} />
                    <span className="capitalize">{contribution.status}</span>
                  </span>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm">
                      <MessageSquare size={16} />
                      <span>Message</span>
                      {contribution.messages > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white text-teal-600 rounded-full text-xs font-medium">
                          {contribution.messages}
                        </span>
                      )}
                    </button>
                    <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                      <Eye size={16} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredContributions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No contributions found</h3>
          <p className="text-gray-600 mb-4">
            You haven't made any contributions with this status yet
          </p>
          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium">
            Browse Requests
          </button>
        </div>
      )}
    </div>
  );
};

export default MyContributions;
