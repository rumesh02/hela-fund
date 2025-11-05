import { X, MapPin, Calendar, User, AlertCircle, DollarSign, Heart } from 'lucide-react';

const RequestDetailsModal = ({ request, onClose }) => {
  if (!request) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="text-4xl">{getCategoryIcon(request.category)}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{request.title}</h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                  request.urgency
                )}`}
              >
                {request.urgency} Priority
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          </div>

          {/* Request Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <User size={18} />
                <span className="text-sm font-medium">Requester</span>
              </div>
              <p className="text-gray-800 font-medium">{request.requester}</p>
              <p className="text-sm text-gray-500">{request.university}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin size={18} />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-gray-800 font-medium">{request.location}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Calendar size={18} />
                <span className="text-sm font-medium">Posted Date</span>
              </div>
              <p className="text-gray-800 font-medium">
                {new Date(request.postedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <DollarSign size={18} />
                <span className="text-sm font-medium">Estimated Amount</span>
              </div>
              <p className="text-gray-800 font-medium text-lg">{request.estimatedAmount}</p>
            </div>
          </div>

          {/* Category Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-blue-800">Category: {request.category}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">How You Can Help</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Provide financial support for this request</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Connect with the requester through our secure messaging system</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Track the progress of your contribution</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Close
          </button>
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center space-x-2">
            <Heart size={20} />
            <span>Offer Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
