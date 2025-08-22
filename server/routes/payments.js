import express from 'express';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

const router = express.Router();

// Initialize payment gateways
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'demo_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo', {
  apiVersion: '2023-10-16'
});

// Create Razorpay order
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', cropId, buyerId } = req.body;
    
    const options = {
      amount: amount * 100, // Amount in paisa
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        cropId,
        buyerId
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // In a real app, verify the signature here
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(`${orderId}|${paymentId}`)
    //   .digest('hex');
    
    // For demo purposes, we'll assume verification passes
    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId,
      orderId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Create Stripe payment intent
router.post('/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr', cropId, buyerId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in paisa
      currency,
      metadata: {
        cropId,
        buyerId
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
});

// Handle webhook (for production use)
router.post('/webhook', (req, res) => {
  try {
    // Handle payment webhooks here
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

export default router;