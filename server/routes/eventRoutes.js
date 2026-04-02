const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const router = express.Router();

/* CREATE EVENT */
router.post("/create", async (req, res) => {
  const event = await Event.create(req.body);
  res.json(event);
});

/* GET EVENTS */
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

/* REGISTER EVENT */
router.post("/register", async (req, res) => {
  const { userId, eventId, eventTitle } = req.body;

  const registration = await Registration.create({
    userId,
    eventId,
    eventTitle
  });

  res.json(registration);
});

/* GET REGISTERED EVENTS */
router.get("/my/:userId", async (req, res) => {
  const data = await Registration.find({ userId: req.params.userId });
  res.json(data);
});

module.exports = router;