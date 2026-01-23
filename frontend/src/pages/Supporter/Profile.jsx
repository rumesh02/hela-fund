import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Edit2, Save, X, Shield } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Kevin',
    lastName: 'Weston',
    email: 'kevin@gmail.com',
    phone: '+94 77 457 4488',
    address: '12, Main Street, Colombo 03',
    city: 'Dehiwala',
    district: 'Colombo',
    bio: 'Passionate about helping students achieve their educational goals. I believe in giving back to the community and supporting the next generation.',
    occupation: 'Software Engineer',
    workplace: 'Tech Solutions Pvt Ltd'
  });

  const profileStats = {
    trustScore: 4.8,
    totalContributions: 24,
    completedHelps: 18,
    joinedDate: '2024-01-15',
    badges: 8,
    testimonials: 15
  };

  const badges = [
    { name: 'First Help', emoji: '🎯', description: 'Completed first contribution', earned: true },
    { name: 'Quick Responder', emoji: '⚡', description: 'Respond within 24 hours', earned: true },
    { name: 'Trusted Helper', emoji: '🌟', description: 'Maintain 4.5+ trust score', earned: true },
    { name: 'Community Champion', emoji: '🏆', description: 'Help 50+ students', earned: false },
    { name: 'Education Supporter', emoji: '📚', description: 'Support 10+ book requests', earned: true },
    { name: 'Tech Enabler', emoji: '💻', description: 'Support 5+ tech requests', earned: true },
    { name: 'Generous Giver', emoji: '💝', description: 'Contribute LKR 100,000+', earned: false },
    { name: 'Mentor', emoji: '👨‍🏫', description: 'Provide ongoing mentorship', earned: true }
  ];

  const recentTestimonials = [
    {
      id: 1,
      from: 'Kasun Perera',
      university: 'University of Colombo',
      rating: 5,
      comment: 'John was incredibly helpful and responsive. His support for my laptop repair made a huge difference in my studies.',
      date: '2024-11-01'
    },
    {
      id: 2,
      from: 'Nimali Silva',
      university: 'University of Peradeniya',
      rating: 5,
      comment: 'Very generous and kind. The textbooks I received were exactly what I needed. Thank you!',
      date: '2024-10-28'
    },
    {
      id: 3,
      from: 'Sanduni Rathnayake',
      university: 'University of Jaffna',
      rating: 4,
      comment: 'Quick response and genuine care. Highly recommend!',
      date: '2024-10-25'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In real app, save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your profile information and view your impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card & Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{formData.occupation}</p>
              <p className="text-sm text-gray-500">{formData.workplace}</p>

              {/* Trust Score */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Trust Score</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{profileStats.trustScore}/5.0</div>
                <p className="text-xs text-gray-500 mt-1">Based on {profileStats.testimonials} reviews</p>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contributions</span>
                <span className="font-bold text-gray-800">{profileStats.totalContributions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Helps</span>
                <span className="font-bold text-green-600">{profileStats.completedHelps}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Badges Earned</span>
                <span className="font-bold text-yellow-600">{profileStats.badges}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-800">
                  {new Date(profileStats.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email (Verified)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Jaffna</option>
                  <option>Kurunegala</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workplace</label>
                <input
                  type="text"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              <Award className="inline mr-2" size={20} />
              Badges & Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center transition ${
                    badge.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300'
                      : 'bg-gray-50 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <p className="text-xs font-medium text-gray-700">{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Testimonials */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Testimonials</h3>
            <div className="space-y-4">
              {recentTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{testimonial.from}</p>
                      <p className="text-xs text-gray-500">{testimonial.university}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{testimonial.comment}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium">
              View All Testimonials ({profileStats.testimonials})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
