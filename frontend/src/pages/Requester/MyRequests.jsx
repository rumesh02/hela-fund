import { Eye, Edit, Trash2, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const MyRequests = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    description: '',
    urgency: '',
    amount: '',
    itemLostLocation: ''
  });

  // Fetch user's requests from backend
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/requests/my-requests');
        
        if (response.success) {
          setRequests(response.data);
        } else {
          setError(response.message || 'Failed to fetch requests');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching requests');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  // Handler for viewing request details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Handler for editing request
  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setEditFormData({
      title: request.title,
      category: request.category,
      description: request.description,
      urgency: request.urgency,
      amount: request.amount || '',
      itemLostLocation: request.itemLostLocation || ''
    });
    setShowEditModal(true);
  };

  // Handler for updating request
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/requests/${selectedRequest._id}`, editFormData);
      
      if (response.success) {
        // Update local state
        setRequests(requests.map(req => 
          req._id === selectedRequest._id ? { ...req, ...editFormData } : req
        ));
        setShowEditModal(false);
        setSelectedRequest(null);
        alert('Request updated successfully!');
      } else {
        alert(response.message || 'Failed to update request');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while updating the request');
      console.error('Error updating request:', err);
    }
  };

  // Handler for deleting (deactivating) request
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to deactivate this request?')) {
      return;
    }

    try {
      const response = await api.put(`/requests/${requestId}`, { status: 'Inactive' });
      
      if (response.success) {
        // Update local state
        setRequests(requests.map(req => 
          req._id === requestId ? { ...req, status: 'Inactive' } : req
        ));
        alert('Request deactivated successfully!');
      } else {
        alert(response.message || 'Failed to deactivate request');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while deactivating the request');
      console.error('Error deactivating request:', err);
    }
  };

  const filteredRequests =
    categoryFilter === 'all' ? requests : requests.filter((req) => req.category === categoryFilter);

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
        <button 
          onClick={() => navigate('/requester/create-request')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
        >
          + Create New Request
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Filter size={22} className="text-blue-600" />
          </div>
          {['all', 'Lost Item', 'Micro-Funding', 'Community Help'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                categoryFilter === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 text-lg font-medium mt-4">Loading your requests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gradient-to-br from-red-50 to-rose-50">
            <p className="text-red-600 text-lg font-medium">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
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
                    <tr key={request._id} className="hover:bg-blue-50 transition-all">
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
                        <span className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {request.supporters?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                            title="View Details"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all shadow-sm hover:shadow-md"
                            title="Edit Request"
                          >
                            <Edit size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request._id)}
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

            {filteredRequests.length === 0 && !loading && (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <p className="text-gray-600 text-lg font-medium">
                  {categoryFilter === 'all' 
                    ? 'No requests found. Create your first request!' 
                    : `No requests found in ${categoryFilter} category.`}
                </p>
              </div>
            )}
          </>
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
            {requests.reduce((acc, r) => acc + (r.supporters?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Request Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-blue-800 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedRequest.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Category</label>
                  <p className="text-gray-900 mt-1">{selectedRequest.category}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Urgency</label>
                  <p className="mt-1">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getUrgencyColor(selectedRequest.urgency)}`}>
                      {selectedRequest.urgency}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Created Date</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedRequest.category === 'Micro-Funding' && selectedRequest.amount && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Target Amount</label>
                  <p className="text-lg font-bold text-blue-600 mt-1">Rs. {selectedRequest.amount}</p>
                </div>
              )}
              {selectedRequest.category === 'Lost Item' && selectedRequest.itemLostLocation && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Item Lost Location</label>
                  <p className="text-gray-900 mt-1">{selectedRequest.itemLostLocation}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedRequest.description}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Supporters</label>
                <p className="text-gray-900 mt-1">{selectedRequest.supporters?.length || 0} supporter(s)</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Request</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-emerald-800 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Lost Item">Lost Item</option>
                  <option value="Micro-Funding">Micro-Funding</option>
                  <option value="Community Help">Community Help</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency</label>
                <select
                  value={editFormData.urgency}
                  onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              {editFormData.category === 'Micro-Funding' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Needed (Rs.)</label>
                  <input
                    type="number"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}
              {editFormData.category === 'Lost Item' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Lost Location</label>
                  <input
                    type="text"
                    value={editFormData.itemLostLocation}
                    onChange={(e) => setEditFormData({ ...editFormData, itemLostLocation: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Main Library, Second Floor"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="6"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-all"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
