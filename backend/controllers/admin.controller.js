import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';
import User from '../models/User.model.js';
import Request from '../models/Request.model.js';
import Contribution from '../models/Contribution.model.js';

const generateToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify a user (set isVerified: true)
// @route   PUT /api/admin/users/:id/verify
// @access  Private (admin)
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ban a user (set isVerified: false)
// @route   PUT /api/admin/users/:id/ban
// @access  Private (admin)
export const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all requests (admin view, no isVerified filter)
// @route   GET /api/admin/requests
// @access  Private (admin)
export const getAdminRequests = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const requests = await Request.find(query)
      .populate('requester', 'name fullName email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify a request (set isVerified: true)
// @route   PUT /api/admin/requests/:id/verify
// @access  Private (admin)
export const verifyRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block a request (set isVerified: false)
// @route   PUT /api/admin/requests/:id/block
// @access  Private (admin)
export const blockRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Aggregated analytics for the Reports page
// @route   GET /api/admin/reports
// @access  Private (admin)
export const getReports = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // ── Users ──────────────────────────────────────────────
    const users = await User.find({}).select('role isVerified university createdAt');

    const userStats = {
      total: users.length,
      requesters: users.filter(u => u.role === 'requester').length,
      supporters: users.filter(u => u.role === 'supporter').length,
      verified: users.filter(u => u.isVerified).length,
      unverified: users.filter(u => !u.isVerified).length,
    };

    const universityMap = {};
    users.filter(u => u.role === 'requester' && u.university).forEach(u => {
      universityMap[u.university] = (universityMap[u.university] || 0) + 1;
    });
    const topUniversities = Object.entries(universityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const userMonthly = {};
    users.filter(u => new Date(u.createdAt) >= sixMonthsAgo).forEach(u => {
      const key = new Date(u.createdAt).toISOString().slice(0, 7);
      userMonthly[key] = (userMonthly[key] || 0) + 1;
    });

    // ── Requests ───────────────────────────────────────────
    const requests = await Request.find({}).select(
      'category status urgency isVerified amount currentAmount views contributionsCount createdAt'
    );

    const reqStats = {
      total: requests.length,
      active: requests.filter(r => r.status === 'active').length,
      completed: requests.filter(r => r.status === 'completed').length,
      draft: requests.filter(r => r.status === 'draft').length,
      inactive: requests.filter(r => r.status === 'Inactive').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length,
      expired: requests.filter(r => r.status === 'expired').length,
      verified: requests.filter(r => r.isVerified).length,
      unverified: requests.filter(r => !r.isVerified).length,
    };

    const categoryMap = {};
    const urgencyMap = {};
    requests.forEach(r => {
      categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
      urgencyMap[r.urgency]   = (urgencyMap[r.urgency]   || 0) + 1;
    });

    const totalViews         = requests.reduce((s, r) => s + (r.views || 0), 0);
    const totalContributions = requests.reduce((s, r) => s + (r.contributionsCount || 0), 0);

    const reqMonthly = {};
    requests.filter(r => new Date(r.createdAt) >= sixMonthsAgo).forEach(r => {
      const key = new Date(r.createdAt).toISOString().slice(0, 7);
      reqMonthly[key] = (reqMonthly[key] || 0) + 1;
    });

    // ── Micro-Funding ──────────────────────────────────────
    const mfReqs = requests.filter(r => r.category === 'Micro-Funding');
    const mfStats = {
      total: mfReqs.length,
      totalGoal:    mfReqs.reduce((s, r) => s + (r.amount || 0), 0),
      totalRaised:  mfReqs.reduce((s, r) => s + (r.currentAmount || 0), 0),
      fullyFunded:  mfReqs.filter(r => r.amount > 0 && r.currentAmount >= r.amount).length,
    };
    mfStats.successRate  = mfStats.total > 0 ? Math.round((mfStats.fullyFunded / mfStats.total) * 100) : 0;
    mfStats.fundingRate  = mfStats.totalGoal > 0 ? Math.round((mfStats.totalRaised / mfStats.totalGoal) * 100) : 0;

    const topFunded = await Request.find({ category: 'Micro-Funding', currentAmount: { $gt: 0 } })
      .populate('requester', 'fullName university')
      .select('title amount currentAmount contributionsCount requester')
      .sort({ currentAmount: -1 })
      .limit(5);

    // ── Contributions ──────────────────────────────────────
    const contribs = await Contribution.find({}).select('amount currency paymentMethod paymentStatus createdAt');

    const completed = contribs.filter(c => c.paymentStatus === 'completed');
    const contribStats = {
      total:       contribs.length,
      completed:   completed.length,
      pending:     contribs.filter(c => c.paymentStatus === 'pending').length,
      failed:      contribs.filter(c => c.paymentStatus === 'failed').length,
      refunded:    contribs.filter(c => c.paymentStatus === 'refunded').length,
      totalAmount: completed.reduce((s, c) => s + c.amount, 0),
    };
    contribStats.avgAmount = completed.length > 0
      ? Math.round(contribStats.totalAmount / completed.length)
      : 0;

    const paymentMethodMap = {};
    contribs.forEach(c => {
      paymentMethodMap[c.paymentMethod] = (paymentMethodMap[c.paymentMethod] || 0) + 1;
    });

    // ── Monthly trend (last 6 months) ─────────────────────
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      monthlyTrend.push({
        key,
        label:    d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        users:    userMonthly[key] || 0,
        requests: reqMonthly[key] || 0,
      });
    }

    res.json({
      success: true,
      data: {
        generatedAt:    now.toISOString(),
        users:          userStats,
        topUniversities,
        requests:       reqStats,
        categories:     categoryMap,
        urgency:        urgencyMap,
        totalViews,
        totalContributions,
        microFunding:   mfStats,
        topFunded,
        contributions:  contribStats,
        paymentMethods: paymentMethodMap,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private (admin)
export const getAdminMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
