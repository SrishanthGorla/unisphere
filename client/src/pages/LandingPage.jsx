import { useState } from "react";
import EventCard from "../components/EventCard";

export default function LandingPage({ onRegister }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      description: "Build amazing projects",
      category: "Technical",
      image: "https://source.unsplash.com/400x300/?coding"
    },
    {
      id: 2,
      title: "Coding Contest",
      description: "Compete with top coders",
      category: "Technical",
      image: "https://source.unsplash.com/400x300/?programming"
    },
    {
      id: 3,
      title: "Tech Workshop",
      description: "Learn new technologies",
      category: "Workshop",
      image: "https://source.unsplash.com/400x300/?technology"
    },
    {
      id: 4,
      title: "AI & ML Seminar",
      description: "Explore AI trends",
      category: "Technical",
      image: "https://source.unsplash.com/400x300/?ai"
    },
    {
      id: 5,
      title: "Web Dev Bootcamp",
      description: "Full stack learning",
      category: "Workshop",
      image: "https://source.unsplash.com/400x300/?web"
    },
    {
      id: 6,
      title: "Gaming Tournament",
      description: "Esports competition",
      category: "Sports",
      image: "https://source.unsplash.com/400x300/?gaming"
    },
    {
      id: 7,
      title: "Robotics Workshop",
      description: "Build robots",
      category: "Workshop",
      image: "https://source.unsplash.com/400x300/?robot"
    },
    {
      id: 8,
      title: "Cultural Fest",
      description: "Dance & music",
      category: "Cultural",
      image: "https://source.unsplash.com/400x300/?festival"
    },
    {
      id: 9,
      title: "Photography Contest",
      description: "Creative shots",
      category: "Cultural",
      image: "https://source.unsplash.com/400x300/?photography"
    },
    {
      id: 10,
      title: "Sports Meet",
      description: "Athletic events",
      category: "Sports",
      image: "https://source.unsplash.com/400x300/?sports"
    }
  ];

  const categories = ["All", "Technical", "Workshop", "Sports", "Cultural"];

  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(event =>
      category === "All" ? true : event.category === category
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-6 md:p-10">
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        UniSphere Events 🚀
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search events..."
        className="mb-6 px-4 py-3 rounded-xl w-full max-w-md"
        onChange={(e) => setSearch(e.target.value)}
      />

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