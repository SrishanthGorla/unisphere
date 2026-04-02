import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const handleRegister = () => {
    onRegister(event);
    setShowTicket(true);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-white overflow-hidden transform transition duration-300 hover:scale-105">
        
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

          <p className="text-purple-400 text-sm mt-2">
            {event.category}
          </p>

          <button
            onClick={handleRegister}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl"
          >
            Register
          </button>
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
            <h2 className="text-2xl font-bold mb-2">
              🎟 Event Ticket
            </h2>

            <p className="mb-2">{event.title}</p>

            <p className="text-sm text-gray-600">
              Entry Confirmed ✅
            </p>

            <div className="mt-4 p-3 border-dashed border-2">
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
    </>
  );
}