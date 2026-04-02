import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-white">
        
        <img src={event.image} className="w-full h-40 object-cover rounded-xl" />

        <h2 className="text-xl mt-2">{event.title}</h2>
        <p className="text-gray-300">{event.description}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onRegister(event)}
            className="bg-purple-500 px-3 py-2 rounded flex-1"
          >
            Register
          </button>

          <button
            onClick={() => setShowDetails(true)}
            className="bg-gray-700 px-3 py-2 rounded flex-1"
          >
            Details
          </button>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
          
          <div className="bg-white text-black p-6 rounded-2xl w-96">
            
            <h2 className="text-2xl font-bold mb-3">{event.title}</h2>

            <p><b>Date:</b> {event.date}</p>
            <p><b>Time:</b> {event.time}</p>
            <p><b>Venue:</b> {event.venue}</p>
            <p><b>Coordinator:</b> {event.coordinator}</p>
            <p><b>Inspector:</b> {event.inspector}</p>

            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}