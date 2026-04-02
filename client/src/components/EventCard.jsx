import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-white overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        
        {/* IMAGE */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-40 object-cover transition duration-300 hover:scale-110"
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

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onRegister(event)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl"
            >
              Register
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

      {/* DETAILS MODAL */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">
              {event.title}
            </h2>

            <p className="text-gray-300 mb-3">
              {event.description}
            </p>

            <p className="text-purple-400 mb-4">
              Category: {event.category}
            </p>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full bg-red-500 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}