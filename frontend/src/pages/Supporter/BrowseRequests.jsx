import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Eye, HandHeart, MapPin, AlertCircle, Clock, Users } from 'lucide-react';
import RequestDetailsModal from '../../components/Supporter/RequestDetailsModal';
import api from '../../utils/api';

const BrowseRequests = () => {
  const [activeCategory, setActiveCategory] = useState('Micro-Funding');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/requests?category=${activeCategory}&limit=100`);
        setRequests(response.data || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message || 'Failed to fetch requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeCategory]);


  const getUrgencyColor = (urgency) => {
    const colors = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filterRequests = (requestsToFilter) => {
    return requestsToFilter.filter((request) => {
      const urgencyMatch = selectedUrgency === 'all' || request.urgency === selectedUrgency;
      
      let dateMatch = true;
      if (dateFilter !== 'all') {
        const requestDate = new Date(request.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - requestDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today') dateMatch = diffDays <= 1;
        else if (dateFilter === 'week') dateMatch = diffDays <= 7;
        else if (dateFilter === 'month') dateMatch = diffDays <= 30;
      }
      
      return urgencyMatch && dateMatch;
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const filteredRequests = filterRequests(requests);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Requests</h1>
        <p className="text-gray-600 mt-1">Explore and support student requests across different categories</p>
      </div>

      {/* Category Selection Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveCategory('Micro-Funding')}
            className={`py-8 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeCategory === 'Micro-Funding'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <HandHeart className="inline-block mr-2" size={20} />
            Micro Funding
          </button>
          <button
            onClick={() => setActiveCategory('Lost Item')}
            className={`py-8 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeCategory === 'Lost Item'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <MapPin className="inline-block mr-2" size={20} />
            Lost Items
          </button>
          <button
            onClick={() => setActiveCategory('Community Help')}
            className={`py-8 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeCategory === 'Community Help'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-teal-50 hover:text-teal-700'
            }`}
          >
            <Users className="inline-block mr-2" size={20} />
            Community Help
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Urgency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Urgency Level
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Urgencies</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Date Posted
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-800">{filteredRequests.length}</span> request
            {filteredRequests.length !== 1 && 's'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Requests</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Requests Grid - Category Specific Views */}
      {!loading && !error && activeCategory === 'Micro-Funding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Urgency Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    {request.urgency} Priority
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{request.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{request.description}</p>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {request.currency} {request.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      of {request.currency} {request.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((request.currentAmount / request.amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((request.currentAmount / request.amount) * 100)}% funded
                  </p>
                </div>

                {/* Requester Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Requester:</span>{' '}
                    {request.anonymous ? 'Anonymous' : (request.requester?.name || 'Unknown')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Users size={14} className="mr-1" />
                    {request.contributionsCount || 0} supporter{(request.contributionsCount || 0) !== 1 && 's'}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(request)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  <Eye size={18} />
                  <span>View Details & Support</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lost Items View */}
      {!loading && !error && activeCategory === 'Lost Item' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Urgency Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    {request.urgency} Priority
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{request.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{request.description}</p>

                {/* Lost Location */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start text-sm text-gray-700">
                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                    <div>
                      <span className="font-medium">Lost at:</span>
                      <p className="text-gray-600 mt-1">{request.itemLostLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Requester Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Posted by:</span>{' '}
                    {request.anonymous ? 'Anonymous' : (request.requester?.name || 'Unknown')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Eye size={14} className="mr-1" />
                    {request.views || 0} view{(request.views || 0) !== 1 && 's'}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(request)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  <Eye size={18} />
                  <span>View Full Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Help View */}
      {!loading && !error && activeCategory === 'Community Help' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Urgency Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    {request.urgency} Priority
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{request.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{request.description}</p>

                {/* Requester Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Posted by:</span>{' '}
                    {request.anonymous ? 'Anonymous' : (request.requester?.name || 'Unknown')}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {request.supporters?.length || 0} helper{(request.supporters?.length || 0) !== 1 && 's'}
                    </span>
                    <span className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {request.views || 0} view{(request.views || 0) !== 1 && 's'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(request)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                >
                  <Eye size={18} />
                  <span>View Details & Help</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No requests found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      )}

      {/* Request Details Modal */}
      {isModalOpen && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BrowseRequests;
