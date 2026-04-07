const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, default: "" },
  venue: { type: String, default: "" },
  coordinator: { type: String, default: "" },
  inspector: { type: String, default: "" },

  // Capacity and waitlist
  capacity: { type: Number, default: null }, // null means unlimited
  waitlistEnabled: { type: Boolean, default: false },
  currentRegistrations: { type: Number, default: 0 },

  // Pricing
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  paymentMethods: [{ type: String, enum: ['stripe', 'paypal', 'upi', 'offline'] }],

  // Ratings and reviews
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },

  // Status
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },

  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Event", eventSchema);
