const express = require("express");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

const router = express.Router();

// Generate unique transaction ID
const generateTransactionId = () => {
  return "TXN" + Date.now() + crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Create a payment session (checkout)
router.post("/create-session", async (req, res) => {
  try {
    const { userId, eventId, amount, paymentMethod } = req.body;

    // Validate input
    if (!userId || !eventId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Create payment record
    const payment = new Payment({
      transactionId,
      userId,
      eventId,
      amount,
      paymentMethod,
      currency: "INR",
      status: "pending",
      eventTitle: event.title,
      eventDate: event.date,
      ipAddress: req.ip,
      userAgent: req.get("user-agent")
    });

    await payment.save();

    // Return checkout data
    res.json({
      success: true,
      transactionId,
      paymentId: payment._id,
      amount,
      currency: "INR",
      event: {
        title: event.title,
        price: event.price,
        date: event.date
      },
      checkoutUrl: `/checkout?txnId=${transactionId}&paymentId=${payment._id}`
    });
  } catch (error) {
    console.error("Create payment session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Process payment (simulated for now - replace with actual payment gateway)
router.post("/process", async (req, res) => {
  try {
    const { transactionId, paymentDetails, cardToken } = req.body;

    // Find payment
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // Simulate payment processing
    // In production, this would integrate with Stripe, PayPal, etc.
    const isSuccessful = Math.random() > 0.05; // 95% success rate

    if (isSuccessful) {
      // Update payment status
      payment.status = "completed";
      payment.completedAt = new Date();
      payment.stripePaymentIntentId = crypto.randomBytes(8).toString("hex");
      await payment.save();

      // Create or update registration
      let registration = await Registration.findOne({
        userId: payment.userId,
        eventId: payment.eventId
      });

      if (!registration) {
        registration = new Registration({
          userId: payment.userId,
          eventId: payment.eventId,
          eventTitle: payment.eventTitle,
          status: "confirmed"
        });
      }

      registration.isPaid = true;
      registration.paymentAmount = payment.amount;
      registration.paymentStatus = "completed";
      registration.transactionId = transactionId;
      registration.paymentMethod = payment.paymentMethod;
      registration.paidAt = new Date();
      await registration.save();

      payment.registrationId = registration._id;
      await payment.save();

      res.json({
        success: true,
        message: "Payment completed successfully",
        transactionId,
        paymentId: payment._id,
        redirectUrl: `/payment-completed?txnId=${transactionId}`
      });
    } else {
      // Payment failed
      payment.status = "failed";
      await payment.save();

      res.status(400).json({
        success: false,
        message: "Payment failed. Please try again.",
        transactionId
      });
    }
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get payment details
router.get("/:transactionId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ transactionId: req.params.transactionId })
      .populate("userId", "name email")
      .populate("eventId", "title date venue");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user payments
router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("eventId", "title date");

    res.json(payments);
  } catch (error) {
    console.error("Get user payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get payment stats (admin)
router.get("/stats/overview", async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: "completed" });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalPayments,
      completedPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      conversionRate: ((completedPayments / totalPayments) * 100).toFixed(2) + "%"
    });
  } catch (error) {
    console.error("Get payment stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refund payment
router.post("/refund/:transactionId", async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findOne({ transactionId: req.params.transactionId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Only completed payments can be refunded" });
    }

    payment.status = "refunded";
    payment.refundedAmount = payment.amount;
    payment.refundedAt = new Date();
    payment.refundReason = reason || "No reason provided";
    await payment.save();

    // Update registration if exists
    if (payment.registrationId) {
      const registration = await Registration.findById(payment.registrationId);
      if (registration) {
        registration.paymentStatus = "cancelled";
        registration.status = "cancelled";
        await registration.save();
      }
    }

    res.json({
      success: true,
      message: "Payment refunded successfully",
      transactionId: req.params.transactionId
    });
  } catch (error) {
    console.error("Refund payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
