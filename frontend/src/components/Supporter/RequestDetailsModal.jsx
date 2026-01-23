import { X, MapPin, Calendar, User, AlertCircle, Banknote, Heart } from 'lucide-react';

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
      'Micro-Funding': '💰',
      'Lost Item': '🔍',
      'Community Help': '🤝',
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="text-4xl">{getCategoryIcon(request.requestType)}</div>
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
              <p className="text-gray-800 font-medium">
                {request.anonymous ? 'Anonymous' : (request.requester?.name || 'Unknown')}
              </p>
            </div>

            {request.itemLostLocation && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <MapPin size={18} />
                  <span className="text-sm font-medium">Lost Location</span>
                </div>
                <p className="text-gray-800 font-medium">{request.itemLostLocation}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Calendar size={18} />
                <span className="text-sm font-medium">Posted Date</span>
              </div>
              <p className="text-gray-800 font-medium">
                {new Date(request.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {request.amount && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Banknote size={18} />
                  <span className="text-sm font-medium">Amount Needed</span>
                </div>
                <p className="text-gray-800 font-medium text-lg">
                  {request.currency} {request.amount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Funding Progress - Only for Micro-Funding */}
          {request.requestType === 'Micro-Funding' && request.amount && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round((request.currentAmount / request.amount) * 100)}% funded
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-teal-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((request.currentAmount / request.amount) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">
                  {request.currency} {request.currentAmount.toLocaleString()} raised
                </span>
                <span className="text-gray-500">
                  {request.contributionsCount || 0} supporter{(request.contributionsCount || 0) !== 1 && 's'}
                </span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-blue-800">Category: {request.requestType}</span>
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
          <button className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium flex items-center justify-center space-x-2">
            <Heart size={20} />
            <span>Offer Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
