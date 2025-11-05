// Sample data structure for Hela Fund - Requester & Supporter Frontend
// This can be used for development and as a reference for backend API responses

export const sampleUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@university.edu',
  phone: '+94 77 123 4567',
  studentId: 'SC/2022/1234',
  faculty: 'Faculty of Science',
  year: '3rd Year',
  location: 'Colombo, Sri Lanka',
  joinedDate: 'January 2023',
  avatar: 'JD',
  trustScore: 85,
  totalRequests: 24,
  pendingRequests: 8,
  completedRequests: 14,
  rejectedRequests: 2,
  totalFundsReceived: 15000,
};

// Supporter User Data
export const sampleSupporter = {
  id: 2,
  firstName: 'John',
  lastName: 'Supporter',
  email: 'john.supporter@email.com',
  phone: '+94 71 234 5678',
  address: '123 Main Street, Colombo 03',
  city: 'Colombo',
  district: 'Colombo',
  bio: 'Passionate about helping students achieve their educational goals.',
  occupation: 'Software Engineer',
  workplace: 'Tech Solutions Pvt Ltd',
  trustScore: 4.8,
  totalContributions: 24,
  completedHelps: 18,
  ongoingHelps: 6,
  joinedDate: '2024-01-15',
  badges: 8,
  testimonials: 15
};

export const sampleBadges = [
  { id: 1, name: 'Verified Student', icon: '✓', color: 'bg-blue-100 text-blue-700', earned: true },
  { id: 2, name: 'Trusted Requester', icon: '⭐', color: 'bg-yellow-100 text-yellow-700', earned: true },
  { id: 3, name: 'Community Helper', icon: '🤝', color: 'bg-green-100 text-green-700', earned: true },
  { id: 4, name: 'Quick Responder', icon: '⚡', color: 'bg-purple-100 text-purple-700', earned: false },
  { id: 5, name: 'Top Contributor', icon: '🏆', color: 'bg-orange-100 text-orange-700', earned: false },
];

export const sampleRequests = [
  {
    id: 1,
    title: 'Lost Student ID Card',
    description: 'I lost my student ID card near the main library on November 3rd. It has my photo and student number on it.',
    category: 'Lost Item',
    status: 'Pending',
    urgency: 'High',
    location: 'Main Library',
    date: '2025-11-04',
    createdAt: '2025-11-04T10:30:00Z',
    supporters: 3,
    anonymous: false,
    proof: null,
  },
  {
    id: 2,
    title: 'Textbook for Semester',
    description: 'Need financial help to purchase required textbooks for this semester. Total cost is Rs. 5000.',
    category: 'Micro-Funding',
    status: 'Completed',
    urgency: 'Medium',
    location: 'Faculty of Science',
    date: '2025-11-03',
    createdAt: '2025-11-03T14:20:00Z',
    supporters: 1,
    anonymous: false,
    proof: 'receipt.pdf',
    fundingGoal: 5000,
    fundingReceived: 5000,
  },
  {
    id: 3,
    title: 'Study Group Formation',
    description: 'Looking for students interested in forming a study group for Advanced Mathematics.',
    category: 'Community Help',
    status: 'Pending',
    urgency: 'Low',
    location: 'Faculty of Science',
    date: '2025-11-02',
    createdAt: '2025-11-02T09:15:00Z',
    supporters: 5,
    anonymous: false,
    proof: null,
  },
  {
    id: 4,
    title: 'Lab Equipment Found',
    description: 'Found a calculator in the Chemistry lab. Owner can claim it.',
    category: 'Lost Item',
    status: 'In Progress',
    urgency: 'Medium',
    location: 'Chemistry Lab',
    date: '2025-11-01',
    createdAt: '2025-11-01T16:45:00Z',
    supporters: 2,
    anonymous: false,
    proof: 'calculator_photo.jpg',
  },
  {
    id: 5,
    title: 'Assignment Help Needed',
    description: 'Need help understanding a complex assignment topic. Willing to meet up.',
    category: 'Community Help',
    status: 'Rejected',
    urgency: 'High',
    location: 'Faculty of Engineering',
    date: '2025-10-30',
    createdAt: '2025-10-30T11:00:00Z',
    supporters: 0,
    anonymous: true,
    proof: null,
    rejectionReason: 'Duplicate request',
  },
];

export const sampleConversations = [
  {
    id: 1,
    userId: 2,
    name: 'Sarah Johnson',
    role: 'Supporter',
    avatar: 'SJ',
    lastMessage: 'I found your student ID near the library!',
    lastMessageTime: '2025-11-05T14:30:00Z',
    unreadCount: 2,
    online: true,
    requestId: 1,
  },
  {
    id: 2,
    userId: 3,
    name: 'Mike Chen',
    role: 'Supporter',
    avatar: 'MC',
    lastMessage: 'I can help with the textbook funding.',
    lastMessageTime: '2025-11-05T13:15:00Z',
    unreadCount: 0,
    online: true,
    requestId: 2,
  },
  {
    id: 3,
    userId: 4,
    name: 'Emily Davis',
    role: 'Supporter',
    avatar: 'ED',
    lastMessage: 'When do you need the study materials?',
    lastMessageTime: '2025-11-05T11:20:00Z',
    unreadCount: 1,
    online: false,
    requestId: 3,
  },
  {
    id: 4,
    userId: 5,
    name: 'David Wilson',
    role: 'Supporter',
    avatar: 'DW',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: '2025-11-04T09:45:00Z',
    unreadCount: 0,
    online: false,
    requestId: 4,
  },
];

export const sampleMessages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    senderName: 'Sarah Johnson',
    content: 'Hi! I saw your request about the lost student ID.',
    timestamp: '2025-11-05T10:30:00Z',
    read: true,
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    senderName: 'John Doe',
    content: 'Yes! Have you found it?',
    timestamp: '2025-11-05T10:32:00Z',
    read: true,
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 2,
    senderName: 'Sarah Johnson',
    content: 'I found your student ID near the library! I can meet you there to return it.',
    timestamp: '2025-11-05T10:35:00Z',
    read: true,
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 1,
    senderName: 'John Doe',
    content: "That's amazing! Thank you so much! I can meet you at 2 PM today.",
    timestamp: '2025-11-05T10:36:00Z',
    read: true,
  },
  {
    id: 5,
    conversationId: 1,
    senderId: 2,
    senderName: 'Sarah Johnson',
    content: 'Perfect! See you at the main entrance.',
    timestamp: '2025-11-05T10:38:00Z',
    read: false,
  },
];

export const sampleNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Sarah Johnson',
    description: 'I found your student ID near the library!',
    timestamp: '2025-11-05T14:30:00Z',
    read: false,
  },
  {
    id: 2,
    type: 'request_update',
    title: 'Request status updated',
    description: 'Your request "Textbook for Semester" has been completed.',
    timestamp: '2025-11-05T12:00:00Z',
    read: true,
  },
  {
    id: 3,
    type: 'supporter',
    title: 'New supporter',
    description: 'Mike Chen is interested in your request.',
    timestamp: '2025-11-05T10:15:00Z',
    read: true,
  },
];

export const categories = [
  { value: 'Lost Item', label: 'Lost Item', icon: '🔍' },
  { value: 'Micro-Funding', label: 'Micro-Funding', icon: '💰' },
  { value: 'Community Help', label: 'Community Help', icon: '🤝' },
];

export const urgencyLevels = [
  { value: 'Low', label: 'Low', color: 'green' },
  { value: 'Medium', label: 'Medium', color: 'yellow' },
  { value: 'High', label: 'High', color: 'red' },
];

export const requestStatuses = [
  { value: 'Pending', label: 'Pending', color: 'yellow' },
  { value: 'In Progress', label: 'In Progress', color: 'blue' },
  { value: 'Completed', label: 'Completed', color: 'green' },
  { value: 'Rejected', label: 'Rejected', color: 'red' },
];

// Helper functions for working with sample data

export const getRequestsByStatus = (status) => {
  if (status === 'all') return sampleRequests;
  return sampleRequests.filter(req => req.status.toLowerCase() === status.toLowerCase());
};

export const getUnreadMessageCount = () => {
  return sampleConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
};

export const getRequestStats = () => {
  return {
    total: sampleRequests.length,
    pending: sampleRequests.filter(r => r.status === 'Pending').length,
    inProgress: sampleRequests.filter(r => r.status === 'In Progress').length,
    completed: sampleRequests.filter(r => r.status === 'Completed').length,
    rejected: sampleRequests.filter(r => r.status === 'Rejected').length,
  };
};

export const getTotalSupporters = () => {
  return sampleRequests.reduce((sum, req) => sum + req.supporters, 0);
};

// API endpoint structure (for backend reference)
export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    verify: '/api/auth/verify',
  },
  requests: {
    getAll: '/api/requests',
    getById: '/api/requests/:id',
    create: '/api/requests',
    update: '/api/requests/:id',
    delete: '/api/requests/:id',
    getByStatus: '/api/requests/status/:status',
    getMine: '/api/requests/mine',
  },
  messages: {
    getConversations: '/api/messages/conversations',
    getMessages: '/api/messages/:conversationId',
    send: '/api/messages',
    markAsRead: '/api/messages/:messageId/read',
  },
  user: {
    getProfile: '/api/user/profile',
    updateProfile: '/api/user/profile',
    getStats: '/api/user/stats',
    getBadges: '/api/user/badges',
  },
  notifications: {
    getAll: '/api/notifications',
    markAsRead: '/api/notifications/:id/read',
    getUnreadCount: '/api/notifications/unread/count',
  },
};
