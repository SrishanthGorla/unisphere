import { useState } from "react";
import EventCard from "../components/EventCard";

export default function LandingPage({ onRegister }) {
  const [search, setSearch] = useState("");

  const events = [
  { id: 1, title: "Hackathon 2026", description: "Build amazing projects" },
  { id: 2, title: "Coding Contest", description: "Compete with top coders" },
  { id: 3, title: "Tech Workshop", description: "Learn new technologies" },

  { id: 4, title: "AI & ML Seminar", description: "Explore AI trends and future" },
  { id: 5, title: "Web Development Bootcamp", description: "Learn full stack development" },
  { id: 6, title: "Cybersecurity Talk", description: "Understand ethical hacking basics" },

  { id: 7, title: "Startup Pitch Event", description: "Present your business ideas" },
  { id: 8, title: "Gaming Tournament", description: "Compete in esports battles" },
  { id: 9, title: "Robotics Workshop", description: "Build and program robots" },

  { id: 10, title: "Cultural Fest", description: "Enjoy dance, music & fun" },
  { id: 11, title: "Photography Contest", description: "Show your creativity" },
  { id: 12, title: "Sports Meet", description: "Participate in athletic events" }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-10">
      
      <h1 className="text-5xl font-bold text-white mb-6">
        UniSphere Events 🚀
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search events..."
        className="mb-8 px-4 py-3 rounded-xl w-full max-w-md"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-8">
        {events
          .filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .map(event => (
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