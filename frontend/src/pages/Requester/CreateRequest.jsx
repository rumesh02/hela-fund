import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: '',
    location: '',
    proof: null,
    anonymous: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    alert('Request submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to submit your help request.</p>
        </div>

      {/* Info Alert */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4 shadow-lg">
        <div className="bg-blue-600 p-3 rounded-xl">
          <AlertCircle className="text-white flex-shrink-0" size={24} strokeWidth={2.5} />
        </div>
        <div className="text-sm text-blue-900">
          <p className="font-bold text-lg mb-2">Tips for a successful request:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-blue-800 font-medium">
            <li>Be clear and specific about what you need</li>
            <li>Provide as much detail as possible</li>
            <li>Upload relevant proof or documentation</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Lost Student ID Card"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Provide detailed information about your request..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all hover:border-gray-300"
            />
          </div>

          {/* Category and Urgency Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
              >
                <option value="">Select a category</option>
                <option value="Lost Item">Lost Item</option>
                <option value="Micro-Funding">Micro-Funding</option>
                <option value="Community Help">Community Help</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
              >
                <option value="">Select urgency level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Main Library, Faculty of Science"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
            />
          </div>

          {/* Proof Upload */}
          <div>
            <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Proof/Documentation
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-all bg-gradient-to-br from-blue-50 to-white hover:shadow-lg">
              <div className="bg-blue-100 p-4 rounded-xl inline-block mb-3">
                <Upload className="mx-auto text-blue-600" size={36} strokeWidth={2.5} />
              </div>
              <label htmlFor="proof" className="cursor-pointer">
                <span className="text-blue-600 font-bold hover:text-blue-700 text-lg">
                  Click to upload
                </span>
                <span className="text-gray-600 font-medium"> or drag and drop</span>
                <input
                  type="file"
                  id="proof"
                  name="proof"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
              <p className="text-xs text-gray-500 mt-3 font-medium">PNG, JPG, PDF up to 10MB</p>
              {formData.proof && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-700 font-semibold">
                    ✓ Selected: {formData.proof.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="anonymous" className="ml-3 text-sm text-gray-900 font-medium">
              Submit this request anonymously
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg hover:shadow-xl"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                title: '',
                description: '',
                category: '',
                urgency: '',
                location: '',
                proof: null,
                anonymous: false,
              })}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all shadow-sm hover:shadow-md"
            >
              Clear Form
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateRequest;
