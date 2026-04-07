const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Get all events with optional filtering
router.get("/", async (req, res) => {
  try {
    const { category, status = 'active', limit, sort = 'date' } = req.query;

    let query = { status };

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = {};
    switch (sort) {
      case 'name':
        sortOption = { title: 1 };
        break;
      case 'date':
        sortOption = { date: 1 };
        break;
      case 'popular':
        sortOption = { currentRegistrations: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const events = await Event.find(query)
      .sort(sortOption)
      .limit(limit ? parseInt(limit) : 0);

    return res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Create new event
router.post("/create", async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.body.createdBy || null, // Will be set by auth middleware later
      currentRegistrations: 0
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'date'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Validate capacity
    if (eventData.capacity && eventData.capacity < 1) {
      return res.status(400).json({ message: "Capacity must be at least 1" });
    }

    // Validate price for paid events
    if (eventData.isPaid && (!eventData.price || eventData.price < 0)) {
      return res.status(400).json({ message: "Price is required for paid events" });
    }

    const event = await Event.create(eventData);
    return res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    if (error.name === 'ValidationError' || error.name === 'MongoServerError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Note: In a real app, you'd also need to handle deleting associated registrations
    return res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get event statistics
router.get("/:id/stats", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const stats = {
      totalRegistrations: event.currentRegistrations,
      capacity: event.capacity,
      spotsLeft: event.capacity ? event.capacity - event.currentRegistrations : null,
      averageRating: event.averageRating,
      totalReviews: event.totalReviews,
      status: event.status
    };

    return res.json(stats);
  } catch (error) {
    console.error('Event stats error:', error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;