const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const User = require("./models/User");
const Event = require("./models/Event");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }

  if (fs.existsSync(clientBuildPath)) {
    return res.sendFile(path.join(clientBuildPath, "index.html"));
  }

  return res.send("UniSphere API is running. Use /api/... routes or build the client app to serve the frontend.");
});

const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI = process.env.MONGODB_URI || (!isProduction ? "mongodb://127.0.0.1:27017/unisphere" : null);
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required in production. Set it in Render environment variables.");
  process.exit(1);
}

const defaultEvents = [
  {
    title: "Hackathon 2026",
    description: "Build amazing projects",
    category: "Technical",
    image: "https://www.cpduk.co.uk/sites/default/files/news-imported/cpd-product-marketing-alliance-best-practices-hackathon.jpg",
    date: "Feb 12 2026",
    time: "9:00 AM - 6:00 PM",
    venue: "Main Auditorium",
    coordinator: "Sanjay Karupothula",
    inspector: "Prof. Rajesh, IIT Hyderabad"
  },
  {
    title: "Coding Contest",
    description: "Compete with top coders",
    category: "Technical",
    image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/coding-competition-design-template-87dba6fa6e8291b8fe5e29abc492288a_screen.jpg",
    date: "Feb 15 2026",
    time: "10:00 AM - 2:00 PM",
    venue: "Lab Block A",
    coordinator: "Dharmatej",
    inspector: "Prof. Meena, NIT Warangal"
  },
  {
    title: "Tech Workshop",
    description: "Learn new technologies",
    category: "Workshop",
    image: "https://img.freepik.com/free-photo/people-repairing-computer-chips_23-2150880942.jpg",
    date: "Feb 18 2026",
    time: "11:00 AM - 4:00 PM",
    venue: "Seminar Hall",
    coordinator: "B. Naveen Kumar",
    inspector: "Prof. Arjun, JNTU"
  },
  {
    title: "AI & ML Seminar",
    description: "Explore AI trends",
    category: "Technical",
    image: "https://aiml.sairam.edu.in/wp-content/uploads/sites/16/2023/11/5technical-1.1.jpg",
    date: "Feb 20 2026",
    time: "2:00 PM - 5:00 PM",
    venue: "Conference Hall",
    coordinator: "Ayush Pandya",
    inspector: "Prof. Kiran, IIIT Hyderabad"
  },
  {
    title: "Web Dev Bootcamp",
    description: "Full stack learning",
    category: "Workshop",
    image: "https://t4.ftcdn.net/jpg/08/61/69/45/360_F_861694590_3jqiyNFhOfL3LVpgmLQ7GmiNq6esOu6T.jpg",
    date: "Apr 22 2026",
    time: "10:00 AM - 5:00 PM",
    venue: "Computer Lab",
    coordinator: "Sanjay Karupothula",
    inspector: "Prof. Ravi, Osmania University"
  },
  {
    title: "Gaming Tournament",
    description: "Esports competition",
    category: "Sports",
    image: "https://gamespace.com/wp-content/uploads/2021/04/Tournaments.jpg",
    date: "Apr 25 2026",
    time: "12:00 PM - 6:00 PM",
    venue: "Indoor Stadium",
    coordinator: "Dharmatej",
    inspector: "Prof. Vivek, SR University"
  },
  {
    title: "Robotics Bootcamp",
    description: "Build and program robots",
    category: "Workshop",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoHKIS4npZUnOIosoWywIylyuv3WZpG37QYg&s",
    date: "May 27 2026",
    time: "9:00 AM - 3:00 PM",
    venue: "Robotics Lab",
    coordinator: "B. Naveen Kumar",
    inspector: "Prof. Anil, IIT Madras"
  },
  {
    title: "Photography Contest",
    description: "Show your creativity",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    date: "Mar 21 2026",
    time: "10:00 AM - 1:00 PM",
    venue: "Campus Grounds",
    coordinator: "Ayush Pandya",
    inspector: "Prof. Sita, Fine Arts College"
  },
  {
    title: "Sports Meet",
    description: "Participate in athletic events",
    category: "Sports",
    image: "https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg",
    date: "Apr 25 2026",
    time: "8:00 AM - 4:00 PM",
    venue: "Playground",
    coordinator: "Dharmatej",
    inspector: "Prof. Ramesh, Sports Authority"
  }
];

const seedData = async () => {
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.create(defaultEvents);
    console.log("Seeded default events.");
  }

  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin"
    });
    console.log("Created default admin user.");
  }
};

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedData();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
