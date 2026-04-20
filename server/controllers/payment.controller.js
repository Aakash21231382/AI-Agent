import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js";

// Lazy init — ensures dotenv has loaded before reading env vars
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// Credit packages
const PLANS = {
  starter: { credits: 100, amount: 9900 },   // ₹99
  pro:     { credits: 300, amount: 24900 },  // ₹249
  elite:   { credits: 700, amount: 49900 },  // ₹499
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    console.log("createOrder called, plan:", plan, "userId:", req.userId);
    console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);

    if (!PLANS[plan]) {
      return res.status(400).json({ message: "Invalid plan selected." });
    }

    const { amount, credits } = PLANS[plan];

    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: String(req.userId), credits, plan },
    });

    console.log("Order created:", order.id);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      credits,
      plan,
    });
  } catch (error) {
    console.error("Create order error full:", error?.error || error?.message || error);
    return res.status(500).json({ message: error?.error?.description || "Failed to create order." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, credits } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed." });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { credits: Number(credits) } },
      { new: true }
    );

    return res.status(200).json({
      message: "Payment successful. Credits added.",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: "Payment verification error." });
  }
};
