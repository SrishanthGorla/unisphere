const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // Transaction ID (unique)
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // User and Event reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration"
  },

  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment method and gateway
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'upi', 'offline'],
    required: true
  },
  stripePaymentIntentId: { type: String },
  paypalTransactionId: { type: String },

  // Event details snapshot
  eventTitle: { type: String, required: true },
  eventDate: { type: String },
  userName: { type: String },
  userEmail: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },

  // Refund info
  refundedAmount: { type: Number, default: 0 },
  refundedAt: { type: Date },
  refundReason: { type: String },

  // Additional metadata
  ipAddress: { type: String },
  userAgent: { type: String },
  notes: { type: String }
});

// Indexes for efficient queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ eventId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
