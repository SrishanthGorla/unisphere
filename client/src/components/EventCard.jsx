import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // 🧠 SAFE DATE PARSE
  const today = new Date();
  const eventDate = event.date ? new Date(event.date) : null;

  // 🟢 STATUS LOGIC (IMPROVED)
  const getStatus = () => {
    if (!eventDate) return { text: "Unknown", color: "bg-gray-500" };

    if (eventDate.toDateString() === today.toDateString()) {
      return { text: "Ongoing", color: "bg-green-500" };
    } else if (eventDate > today) {
      return { text: "Upcoming", color: "bg-blue-500" };
    } else {
      return { text: "Completed", color: "bg-gray-500" };
    }
  };

  const status = getStatus();

  // ❌ CHECK IF REGISTRATION CLOSED
  const isClosed = eventDate && eventDate < today;

  const handleRegister = () => {
    if (isClosed) {
      alert("Registration Closed ❌");
      return;
    }

    onRegister(event);
    setShowTicket(true);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-white overflow-hidden transform transition duration-300 hover:scale-105">
        
        {/* IMAGE */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-40 object-cover"
          />

          {/* STATUS BADGE */}
          <span className={`absolute top-2 left-2 px-3 py-1 text-xs rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{event.title}</h2>

            <button onClick={() => setLiked(!liked)}>
              {liked ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="text-gray-300 mt-2">{event.description}</p>

          <p className="text-purple-400 text-sm mt-2">
            {event.category}
          </p>

          {/* 📅 EXTRA INFO */}
          <p className="text-sm text-gray-400 mt-1">📅 {event.date}</p>
          <p className="text-sm text-gray-400">📍 {event.venue}</p>

          {/* BUTTONS */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleRegister}
              disabled={isClosed}
              className={`flex-1 px-4 py-2 rounded-xl transition ${
                isClosed
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105"
              }`}
            >
              {isClosed ? "Closed ❌" : "Register"}
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 bg-white/10 px-4 py-2 rounded-xl"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* 🎟 TICKET POPUP */}
      {showTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setShowTicket(false)}
        >
          <div
            className="bg-white text-black p-6 rounded-2xl w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">🎟 Event Ticket</h2>

            <p className="mb-2 font-semibold">{event.title}</p>

            <p className="text-sm text-gray-600">Entry Confirmed ✅</p>

            <div className="mt-4 p-3 border-dashed border-2 rounded">
              ID: {Math.floor(Math.random() * 100000)}
            </div>

            <button
              onClick={() => setShowTicket(false)}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 📄 DETAILS POPUP */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-gray-900 text-white p-6 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3">{event.title}</h2>

            <p>📅 Date: {event.date}</p>
            <p>⏰ Time: {event.time || "N/A"}</p>
            <p>📍 Venue: {event.venue}</p>
            <p>👨‍💼 Coordinator: {event.coordinator || "N/A"}</p>
            <p>🎓 Inspector: {event.inspector || "N/A"}</p>

            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 bg-red-500 px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}