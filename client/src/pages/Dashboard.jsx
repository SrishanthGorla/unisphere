import { useState, useEffect, useCallback } from "react";
import EventRating from "../components/EventRating";
import { rateEvent, getUserPayments, fetchRegistrations } from "../api";

export default function Dashboard({ registered, user }) {
  const [activeTab, setActiveTab] = useState("events");
  const [payments, setPayments] = useState([]);
  const [liveRegistered, setLiveRegistered] = useState(registered || []);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const today = new Date();

  const loadRegistrations = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      setIsRefreshing(true);
      const response = await fetchRegistrations(user.id);
      const registeredEvents = response.data.map((registration) => {
        const event = registration.eventId || {};
        return {
          ...registration,
          eventId: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          venue: event.venue,
          coordinator: event.coordinator,
          inspector: event.inspector,
          category: event.category,
          image: event.image,
          isPaid: event.isPaid,
          price: event.price,
          capacity: event.capacity,
          waitlistEnabled: event.waitlistEnabled,
          currentRegistrations: event.currentRegistrations,
          averageRating: event.averageRating,
          totalReviews: event.totalReviews
        };
      });
      setLiveRegistered(registeredEvents);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      loadRegistrations();
      
      // Auto-refresh every 2 seconds
      const interval = setInterval(() => {
        loadRegistrations();
      }, 2000);

      // Also fetch payments on mount
      const fetchPayments = async () => {
        try {
          const response = await getUserPayments(user.id);
          setPayments(response.data || []);
        } catch (error) {
          console.error("Failed to fetch payments:", error);
          setPayments([]);
        }
      };
      fetchPayments();

      return () => clearInterval(interval);
    }
  }, [user, loadRegistrations]);

  const handleRateEvent = async (registrationId, rating, review) => {
    await rateEvent(registrationId, rating, review);
    window.location.reload();
  };
  const upcoming = liveRegistered.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate > today;
  }).length;
  const completed = liveRegistered.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate < today;
  }).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl">Dashboard 📊</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            <p>Last refresh: {lastRefresh.toLocaleTimeString()}</p>
            <p className="flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
              {isRefreshing ? 'Refreshing...' : '✓ Live data'}
            </p>
          </div>
        </div>
      </div>

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
              <p className="text-3xl font-bold">{liveRegistered.length}</p>
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

          {liveRegistered.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-gray-300 text-center">
              No events registered yet. Explore the home page to join a new event.
            </div>
          ) : (
            <div className="grid gap-6">
              {liveRegistered.map((event, index) => {
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
                          registration={liveRegistered.find(reg => reg.eventId === event.id)}
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
        <div>
          {payments.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-400 text-center">
              No payments yet. Purchase a ticket for a paid event to see payment history.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="bg-white/10 border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Total Paid</p>
                  <p className="text-2xl font-bold">₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0)}</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Transactions</p>
                  <p className="text-2xl font-bold">{payments.length}</p>
                </div>
              </div>

              {payments.map((payment, index) => (
                <div key={index} className="bg-white/10 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">Transaction ID: {payment.transactionId}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{payment.amount}</p>
                      <span className={`text-sm px-3 py-1 rounded-full inline-block mt-2 ${
                        payment.status === "completed" ? "bg-green-500/20 text-green-400" :
                        payment.status === "refunded" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-sm">
                    <span className="text-gray-400">
                      Payment Method: <span className="text-white capitalize">{payment.paymentMethod === "upi" ? "UPI" : payment.paymentMethod}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

