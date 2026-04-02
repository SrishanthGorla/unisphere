import { useState } from "react";
import EventCard from "../components/EventCard";

export default function LandingPage({ onRegister }) {
  const [search, setSearch] = useState("");

  const events = [
    { id: 1, title: "Hackathon 2026", description: "Build amazing projects" },
    { id: 2, title: "Coding Contest", description: "Compete with coders" },
    { id: 3, title: "Tech Workshop", description: "Learn new tech" }
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