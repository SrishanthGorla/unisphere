const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  eventTitle: String
});

module.exports = mongoose.model("Registration", registrationSchema);