import { useState } from "react";
import EventRating from "../components/EventRating";
import { rateEvent } from "../api";

export default function Dashboard({ registered }) {
  const [activeTab, setActiveTab] = useState("events");
  const today = new Date();

  const handleRateEvent = async (registrationId, rating, review) => {
    await rateEvent(registrationId, rating, review);
    window.location.reload();
  };
  const upcoming = registered.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate > today;
  }).length;
  const completed = registered.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate < today;
  }).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl mb-6">Dashboard 📊</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "events"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          📅 My Events
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "payments"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          💳 Payment History
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <p className="text-sm text-gray-400">Total Registered</p>
              <p className="text-3xl font-bold">{registered.length}</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <p className="text-sm text-gray-400">Upcoming</p>
              <p className="text-3xl font-bold">{upcoming}</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-3xl font-bold">{completed}</p>
            </div>
          </div>

          {registered.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-gray-300 text-center">
              No events registered yet. Explore the home page to join a new event.
            </div>
          ) : (
            <div className="grid gap-6">
              {registered.map((event, index) => {
                const eventDate = new Date(event.date);
                const status = eventDate.toDateString() === today.toDateString()
                  ? "Ongoing"
                  : eventDate > today
                  ? "Upcoming"
                  : "Completed";
                const statusClass =
                  status === "Upcoming"
                    ? "bg-blue-500"
                    : status === "Ongoing"
                    ? "bg-green-500"
                    : "bg-gray-500";

                return (
                  <div
                    key={index}
                    className="bg-white/10 p-5 rounded-3xl border border-white/20 shadow-xl"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{event.title}</h2>
                        <p className="text-gray-400 mt-2">{event.description}</p>
                      </div>

                      <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClass}`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm text-gray-300">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Date</p>
                        <p className="mt-1">{event.date}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Time</p>
                        <p className="mt-1">{event.time || "N/A"}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Venue</p>
                        <p className="mt-1">{event.venue}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Coordinator</p>
                        <p className="mt-1">{event.coordinator || "N/A"}</p>
                      </div>
                    </div>

                    {/* Rating Component for Completed Events */}
                    {status === "Completed" && (
                      <div className="mt-4">
                        <EventRating
                          event={event}
                          registration={registered.find(reg => reg.eventId === event.id)}
                          onRate={handleRateEvent}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400">Payment history is not available in local mode.</p>
        </div>
      )}
    </div>
  );
}

