const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  phone: { type: String, default: "" },
  college: { type: String, default: "" },
  blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
