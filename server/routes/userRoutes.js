const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email role phone college blocked");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/block/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = true;
    await user.save();

    return res.json({ message: "User blocked" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/unblock/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = false;
    await user.save();

    return res.json({ message: "User unblocked" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
