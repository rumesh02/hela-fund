import { useState } from 'react';
import { Search, Filter, MapPin, AlertCircle, Calendar, Eye } from 'lucide-react';
import RequestDetailsModal from '../../components/Supporter/RequestDetailsModal';

const BrowseRequests = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Books', 'Electronics', 'Transport', 'Medical', 'Food', 'Other'];
  const urgencies = ['All', 'High', 'Medium', 'Low'];
  const locations = ['All', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Kurunegala'];

  const requests = [
    {
      id: 1,
      title: 'Need Laptop for Online Classes',
      category: 'Electronics',
      urgency: 'High',
      location: 'Colombo',
      requester: 'Kasun Perera',
      university: 'University of Colombo',
      description: 'My laptop broke down and I urgently need one for online lectures and assignments.',
      postedDate: '2024-11-03',
      estimatedAmount: 'LKR 50,000',
      status: 'active'
    },
    {
      id: 2,
      title: 'Engineering Textbooks Required',
      category: 'Books',
      urgency: 'Medium',
      location: 'Kandy',
      requester: 'Nimali Silva',
      university: 'University of Peradeniya',
      description: 'Looking for second-hand engineering textbooks for second year studies.',
      postedDate: '2024-11-04',
      estimatedAmount: 'LKR 8,000',
      status: 'active'
    },
    {
      id: 3,
      title: 'Monthly Bus Pass Support',
      category: 'Transport',
      urgency: 'Medium',
      location: 'Galle',
      requester: 'Amila Fernando',
      university: 'University of Ruhuna',
      description: 'Need help with monthly transport expenses to attend university.',
      postedDate: '2024-11-02',
      estimatedAmount: 'LKR 3,500',
      status: 'active'
    },
    {
      id: 4,
      title: 'Internet Data Package',
      category: 'Electronics',
      urgency: 'High',
      location: 'Jaffna',
      requester: 'Sanduni Rathnayake',
      university: 'University of Jaffna',
      description: 'Required internet data package for research work and online submissions.',
      postedDate: '2024-11-05',
      estimatedAmount: 'LKR 2,000',
      status: 'active'
    },
    {
      id: 5,
      title: 'Medical Supplies for Surgery Recovery',
      category: 'Medical',
      urgency: 'High',
      location: 'Colombo',
      requester: 'Ruwan Wickramasinghe',
      university: 'University of Sri Jayewardenepura',
      description: 'Need medical supplies and medicines for post-surgery recovery to continue studies.',
      postedDate: '2024-11-01',
      estimatedAmount: 'LKR 15,000',
      status: 'active'
    },
    {
      id: 6,
      title: 'Meal Plan Support',
      category: 'Food',
      urgency: 'Low',
      location: 'Kurunegala',
      requester: 'Nimal Jayasuriya',
      university: 'Wayamba University',
      description: 'Looking for meal support for the next two weeks during exam period.',
      postedDate: '2024-11-04',
      estimatedAmount: 'LKR 5,000',
      status: 'active'
    }
  ];

  const getUrgencyColor = (urgency) => {
    const colors = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredRequests = requests.filter((request) => {
    const categoryMatch = selectedCategory === 'all' || request.category === selectedCategory;
    const urgencyMatch = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    const locationMatch = selectedLocation === 'all' || request.location === selectedLocation;
    const searchMatch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && urgencyMatch && locationMatch && searchMatch;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Browse Requests</h1>
        <p className="text-gray-600 mt-2">Find students who need your support</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Urgency
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {urgencies.map((urg) => (
                <option key={urg} value={urg.toLowerCase()}>
                  {urg}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc.toLowerCase()}>
                  {loc}
                </option>
              ))}
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

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Category Icon & Urgency Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{getCategoryIcon(request.category)}</div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                  request.urgency
                )}`}
              >
                {request.urgency}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{request.title}</h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{request.description}</p>

            {/* Requester Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Requester:</span> {request.requester}
              </p>
              <p className="text-xs text-gray-500">{request.university}</p>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={14} className="mr-1" />
                {request.location}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={14} className="mr-1" />
                Posted: {new Date(request.postedDate).toLocaleDateString()}
              </div>
              <div className="text-sm font-medium text-blue-600">
                Estimated: {request.estimatedAmount}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleViewDetails(request)}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Eye size={18} />
              <span>View Details</span>
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No requests found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
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
