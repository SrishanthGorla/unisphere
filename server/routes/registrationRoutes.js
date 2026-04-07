const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const router = express.Router();

// Register for an event with capacity and waitlist logic
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, eventTitle } = req.body;
    if (!userId || !eventId || !eventTitle) {
      return res.status(400).json({ message: "Missing registration data" });
    }

    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== 'active') {
      return res.status(400).json({ message: "Event is not available for registration" });
    }

    let registrationStatus = 'confirmed';
    let waitlistPosition = null;

    // Check capacity
    if (event.capacity && event.currentRegistrations >= event.capacity) {
      if (!event.waitlistEnabled) {
        return res.status(400).json({ message: "Event is full" });
      }
      // Add to waitlist
      registrationStatus = 'waitlisted';
      const waitlistCount = await Registration.countDocuments({
        eventId,
        status: 'waitlisted'
      });
      waitlistPosition = waitlistCount + 1;
    }

    const registration = await Registration.create({
      userId,
      eventId,
      eventTitle,
      status: registrationStatus,
      waitlistPosition
    });

    // Update event registration count
    if (registrationStatus === 'confirmed') {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentRegistrations: 1 }
      });
    }

    return res.status(201).json({
      ...registration.toObject(),
      message: registrationStatus === 'waitlisted'
        ? `Added to waitlist (Position ${waitlistPosition})`
        : 'Successfully registered!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Submit rating and review for an event
router.post("/rate/:registrationId", async (req, res) => {
  try {
    const { rating, review } = req.body;
    const registrationId = req.params.registrationId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if event has ended
    const event = await Event.findById(registration.eventId);
    if (!event || new Date(event.date) > new Date()) {
      return res.status(400).json({ message: "Cannot rate event that hasn't ended yet" });
    }

    // Update registration with rating
    registration.rating = rating;
    registration.review = review;
    registration.reviewedAt = new Date();
    await registration.save();

    // Update event's average rating
    const allRatings = await Registration.find({
      eventId: registration.eventId,
      rating: { $exists: true }
    }).select('rating');

    const totalRating = allRatings.reduce((sum, reg) => sum + reg.rating, 0);
    const averageRating = totalRating / allRatings.length;

    await Event.findByIdAndUpdate(registration.eventId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: allRatings.length
    });

    return res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error('Rating error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Cancel registration
router.delete("/:registrationId", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Update event registration count
    if (registration.status === 'confirmed') {
      await Event.findByIdAndUpdate(registration.eventId, {
        $inc: { currentRegistrations: -1 }
      });

      // Move next person from waitlist if available
      if (registration.status === 'confirmed') {
        const nextWaitlisted = await Registration.findOne({
          eventId: registration.eventId,
          status: 'waitlisted'
        }).sort({ waitlistPosition: 1 });

        if (nextWaitlisted) {
          nextWaitlisted.status = 'confirmed';
          nextWaitlisted.waitlistPosition = null;
          await nextWaitlisted.save();

          await Event.findByIdAndUpdate(registration.eventId, {
            $inc: { currentRegistrations: 1 }
          });
        }
      }
    }

    await Registration.findByIdAndDelete(req.params.registrationId);
    return res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error('Cancellation error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/my/:userId", async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.params.userId })
      .populate("eventId")
      .sort({ registeredAt: -1 });
    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "name email")
      .populate("eventId", "title")
      .sort({ registeredAt: -1 });
    return res.json(registrations);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
