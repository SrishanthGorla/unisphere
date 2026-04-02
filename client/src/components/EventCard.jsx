import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-white overflow-hidden">
      
      {/* IMAGE */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{event.title}</h2>

          <button onClick={() => setLiked(!liked)}>
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="text-gray-300 mt-2">{event.description}</p>

        <p className="text-sm text-purple-400 mt-2">
          {event.category}
        </p>

        <button
          onClick={() => onRegister(event)}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl"
        >
          Register
        </button>
      </div>
    </div>
  );
}