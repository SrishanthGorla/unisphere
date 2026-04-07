const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
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
  eventTitle: { type: String, required: true },

  // Registration status
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed'
  },

  // Waitlist position (if applicable)
  waitlistPosition: { type: Number, default: null },

  // Payment information
  isPaid: { type: Boolean, default: false },
  paymentAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionId: { type: String },
  paymentMethod: { type: String },
  paidAt: { type: Date },

  // Registration details
  registeredAt: { type: Date, default: Date.now },

  // Rating and review (after event completion)
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String, maxlength: 500 },
  reviewedAt: { type: Date },

  // Attendance tracking
  attended: { type: Boolean, default: false },
  attendedAt: { type: Date }
});

// Index for efficient queries
registrationSchema.index({ userId: 1, eventId: 1 });
registrationSchema.index({ eventId: 1, status: 1 });
registrationSchema.index({ transactionId: 1 });

module.exports = mongoose.model("Registration", registrationSchema);