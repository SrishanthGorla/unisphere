import { useState } from "react";
import EventCard from "../components/EventCard";

export default function LandingPage({ onRegister }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default"); // ✅ NEW

  const events = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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

  const categories = ["All", "Technical", "Workshop", "Sports", "Cultural"];

  // FILTER
  let filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(event =>
      category === "All" ? true : event.category === category
    );

  // 🔥 SORT LOGIC
  if (sort === "name") {
    filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "date") {
    filteredEvents.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  if (sort === "status") {
    const getPriority = (event) => {
      const today = new Date();
      const eventDate = new Date(event.date);

      if (eventDate.toDateString() === today.toDateString()) return 1;
      if (eventDate > today) return 2;
      return 3;
    };

    filteredEvents.sort((a, b) => getPriority(a) - getPriority(b));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-6 md:p-10">
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        UniSphere Events 🚀
      </h1>

      {/* SEARCH + SORT */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="px-4 py-3 rounded-xl w-full max-w-md bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-800 text-white"
        >
          <option value="default">Sort By</option>
          <option value="name">Name (A-Z)</option>
          <option value="date">Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl ${
              category === cat
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
          />
        ))}
      </div>
    </div>
  );
}