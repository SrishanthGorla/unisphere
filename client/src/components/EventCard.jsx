import { useState, useEffect } from "react";
import { generateGoogleCalendarLink, generateICalendarFile, shareEventOnSocial, copyEventLink } from "../utils/eventUtils";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 🧠 SAFE DATE PARSE
  const today = new Date();
  const eventDate = event.date ? new Date(event.date) : null;

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

  // Countdown timer for upcoming events
  useEffect(() => {
    if (status.text !== "Upcoming" || !eventDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = eventDate.getTime();
      const distance = eventTime - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate, status.text]);

  const isClosed = eventDate && eventDate < today;

  const handleRegister = async () => {
    if (isClosed) {
      alert("Registration Closed ❌");
      return;
    }

    // Check capacity
    if (event.capacity && event.currentRegistrations >= event.capacity && !event.waitlistEnabled) {
      alert("Event is full! No spots available.");
      return;
    }

    // If paid event, redirect to checkout
    if (event.isPaid) {
      window.location.href = `/checkout?eventId=${event._id || event.id}`;
      return;
    }

    try {
      await onRegister(event);
      setShowTicket(true);

      // Refresh the page or update local state to reflect new registration count
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    }
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
          <span className={`absolute top-2 left-2 px-3 py-1 text-xs rounded-full ${status.color}`}>
            {status.text}
          </span>
          {status.text === "Upcoming" && countdown.days >= 0 && (
            <div className="absolute bottom-2 left-2 bg-black/70 rounded-lg px-2 py-1 text-xs text-white">
              {countdown.days > 0 ? `${countdown.days}d ${countdown.hours}h` : `${countdown.hours}h ${countdown.minutes}m`}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{event.title}</h2>

            {/* Rating Display */}
            {event.averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-300">{event.averageRating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({event.totalReviews})</span>
              </div>
            )}

            <button onClick={() => setLiked(!liked)}>
              {liked ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="text-gray-300 mt-2">{event.description}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <p className="text-purple-400 text-sm bg-purple-600/20 px-2 py-1 rounded">
              {event.category}
            </p>

            {/* Price Badge */}
            {event.isPaid ? (
              <p className="text-green-400 text-sm bg-green-600/20 px-2 py-1 rounded">
                💰 ₹{event.price}
              </p>
            ) : (
              <p className="text-blue-400 text-sm bg-blue-600/20 px-2 py-1 rounded">
                🆓 Free
              </p>
            )}

            {/* Capacity Badge */}
            {event.capacity && (
              <p className={`text-sm px-2 py-1 rounded ${
                event.currentRegistrations >= event.capacity
                  ? 'text-red-400 bg-red-600/20'
                  : 'text-orange-400 bg-orange-600/20'
              }`}>
                👥 {event.currentRegistrations}/{event.capacity}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-1">📅 {event.date}</p>
          <p className="text-sm text-gray-400">📍 {event.venue}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleRegister}
              disabled={isClosed}
              className={`flex-1 px-4 py-2 rounded-xl transition ${
                isClosed
                  ? "bg-gray-600 cursor-not-allowed"
                  : event.capacity && event.currentRegistrations >= event.capacity
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105"
              }`}
            >
              {isClosed
                ? "Closed ❌"
                : event.capacity && event.currentRegistrations >= event.capacity
                ? "Join Waitlist ⏳"
                : event.isPaid
                ? "Buy Ticket 🎫"
                : "Register 🚀"
              }
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              title="View Details"
            >
              📋
            </button>

            <button
              onClick={() => window.open(generateGoogleCalendarLink(event), '_blank')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              title="Add to Calendar"
            >
              📅
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                title="Share Event"
              >
                📤
              </button>

              {showShareOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg border border-white/10 z-10">
                  <div className="flex gap-1">
                    <button
                      onClick={() => window.open(shareEventOnSocial(event, 'twitter'), '_blank')}
                      className="p-2 rounded hover:bg-white/10 transition"
                      title="Share on Twitter"
                    >
                      🐦
                    </button>
                    <button
                      onClick={() => window.open(shareEventOnSocial(event, 'facebook'), '_blank')}
                      className="p-2 rounded hover:bg-white/10 transition"
                      title="Share on Facebook"
                    >
                      📘
                    </button>
                    <button
                      onClick={() => window.open(shareEventOnSocial(event, 'whatsapp'), '_blank')}
                      className="p-2 rounded hover:bg-white/10 transition"
                      title="Share on WhatsApp"
                    >
                      💬
                    </button>
                    <button
                      onClick={async () => {
                        const success = await copyEventLink(event);
                        if (success) alert('Event link copied to clipboard!');
                      }}
                      className="p-2 rounded hover:bg-white/10 transition"
                      title="Copy Link"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              )}
            </div>
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

            {/* Rating and Price */}
            <div className="flex justify-between items-center mb-3">
              {event.averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm">{event.averageRating.toFixed(1)} ({event.totalReviews} reviews)</span>
                </div>
              )}
              <div className={`px-3 py-1 rounded text-sm font-semibold ${
                event.isPaid ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {event.isPaid ? `₹${event.price}` : 'Free'}
              </div>
            </div>

            {/* Capacity Info */}
            {event.capacity && (
              <div className="mb-3 p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Capacity:</span>
                  <span className={event.currentRegistrations >= event.capacity ? 'text-red-400' : 'text-green-400'}>
                    {event.currentRegistrations}/{event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((event.currentRegistrations / event.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <p className="mb-2">📅 Date: {event.date}</p>
            <p className="mb-2">⏰ Time: {event.time || "N/A"}</p>
            <p className="mb-2">📍 Venue: {event.venue}</p>
            <p className="mb-2">👨‍💼 Coordinator: {event.coordinator || "N/A"}</p>
            <p className="mb-4">🎓 Inspector: {event.inspector || "N/A"}</p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDetails(false);
                  handleRegister();
                }}
                disabled={isClosed}
                className={`flex-1 px-4 py-2 rounded-xl transition ${
                  isClosed
                    ? "bg-gray-600 cursor-not-allowed"
                    : event.capacity && event.currentRegistrations >= event.capacity
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105"
                }`}
              >
                {isClosed
                  ? "Closed ❌"
                  : event.capacity && event.currentRegistrations >= event.capacity
                  ? "Join Waitlist ⏳"
                  : event.isPaid
                  ? "Buy Ticket 🎫"
                  : "Register 🚀"
                }
              </button>

              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}