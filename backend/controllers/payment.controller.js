import crypto from 'crypto';
import Payment from '../models/Payment.model.js';
import Contribution from '../models/Contribution.model.js';
import Support from '../models/Support.model.js';
import Request from '../models/Request.model.js';
import User from '../models/User.model.js';

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

// @desc    Initiate a PayHere payment — generate hash and create pending payment record
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { amount, requestId, phone } = req.body;

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    if (!requestId) {
      return res.status(400).json({ success: false, message: 'Request ID is required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    if (request.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot contribute to inactive request' });
    }

    const remainingAmount = request.amount - request.currentAmount;
    if (remainingAmount <= 0) {
      return res.status(400).json({ success: false, message: 'This request is already fully funded' });
    }
    if (numericAmount > remainingAmount) {
      return res.status(400).json({ success: false, message: 'Contribution exceeds remaining amount' });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const formattedAmount = numericAmount.toFixed(2);
    const currency = request.currency;
    const merchantId = process.env.PAYHERE_MERCHANT_ID;

    // Hash = MD5(merchant_id + order_id + amount + currency + MD5(secret).toUpperCase()).toUpperCase()
    const hashedSecret = md5(process.env.PAYHERE_MERCHANT_SECRET).toUpperCase();
    const hash = md5(merchantId + orderId + formattedAmount + currency + hashedSecret).toUpperCase();

    await Payment.create({
      orderId,
      supporter: req.user._id,
      request: requestId,
      amount: numericAmount,
      currency
    });

    const fullName = req.user.name || req.user.fullName || 'Supporter';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'User';

    res.json({
      success: true,
      data: {
        merchantId,
        orderId,
        amount: formattedAmount,
        currency,
        hash,
        firstName,
        lastName,
        email: req.user.email,
        phone: phone || '0771234567',
        itemsDescription: `Contribution to: ${request.title}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle PayHere server-to-server payment notification
// @route   POST /api/payments/notify
// @access  Public (called by PayHere servers)
export const handleNotify = async (req, res) => {
  try {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig, payment_id } = req.body;

    // Verify hash: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(secret).toUpperCase()).toUpperCase()
    const hashedSecret = md5(process.env.PAYHERE_MERCHANT_SECRET).toUpperCase();
    const expectedSig = md5(
      merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret
    ).toUpperCase();

    if (md5sig !== expectedSig) {
      console.error(`PayHere notify: invalid hash for order ${order_id}`);
      return res.status(400).send('Invalid signature');
    }

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) {
      return res.status(404).send('Payment not found');
    }

    // status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = chargedback
    if (status_code === '2' && payment.status === 'pending') {
      await completePayment(payment, payment_id);
    } else if (status_code === '-1') {
      payment.status = 'cancelled';
      await payment.save();
    } else if (status_code === '-2' || status_code === '-3') {
      payment.status = 'failed';
      await payment.save();
    }

    res.send('OK');
  } catch (error) {
    console.error('PayHere notify error:', error);
    res.status(500).send('Error');
  }
};

// @desc    Complete payment from frontend callback (for sandbox/localhost where notify_url is unreachable)
// @route   POST /api/payments/complete
// @access  Private
export const completePaymentFromClient = async (req, res) => {
  try {
    const { orderId, payherePaymentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const payment = await Payment.findOne({ orderId, supporter: req.user._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // If already completed (e.g., by notify_url), just return the result
    if (payment.status === 'completed') {
      return res.json({
        success: true,
        data: { requestId: payment.request, amount: payment.amount, currency: payment.currency }
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Payment is already ${payment.status}` });
    }

    await completePayment(payment, payherePaymentId);

    res.json({
      success: true,
      data: { requestId: payment.request, amount: payment.amount, currency: payment.currency }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment status by orderId
// @route   GET /api/payments/verify/:orderId
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId, supporter: req.user._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: { orderId: payment.orderId, status: payment.status, amount: payment.amount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Internal helper ──────────────────────────────────────────────────────────

async function completePayment(payment, payherePaymentId) {
  payment.status = 'completed';
  payment.payherePaymentId = payherePaymentId || null;

  const request = await Request.findById(payment.request);
  if (!request) throw new Error('Request not found');

  const contribution = await Contribution.create({
    amount: payment.amount,
    supporter: payment.supporter,
    request: payment.request,
    paymentMethod: 'card',
    currency: payment.currency,
    paymentStatus: 'completed',
    transactionId: payment.orderId,
    isAnonymous: false
  });

  await Support.create({
    amount: payment.amount,
    currency: payment.currency,
    supporter: payment.supporter,
    request: payment.request,
    contribution: contribution._id,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    transactionId: payment.orderId,
    isAnonymous: false
  });

  payment.contribution = contribution._id;
  await payment.save();

  request.currentAmount += payment.amount;
  request.contributionsCount += 1;

  if (!request.supporters.includes(payment.supporter)) {
    request.supporters.push(payment.supporter);
  }
  if (request.amount && request.currentAmount >= request.amount) {
    request.status = 'completed';
  }
  await request.save();

  await User.findByIdAndUpdate(payment.supporter, { $inc: { totalContributions: 1 } });
}
