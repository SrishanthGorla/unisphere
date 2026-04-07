const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user"
    });

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      blocked: user.blocked
    };

    return res.status(201).json(responseUser);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      blocked: user.blocked
    };

    return res.json(responseUser);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, college } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.college = college ?? user.college;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      blocked: user.blocked
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      college: user.college,
      blocked: user.blocked
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
