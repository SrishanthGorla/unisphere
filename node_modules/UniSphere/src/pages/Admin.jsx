import { useState, useEffect } from "react";
import {
  addEvent,
  updateEvent,
  deleteEvent,
  blockUser,
  fetchAllRegistrations,
  fetchEvents,
  fetchUsers,
  unblockUser
} from "../api";

export default function Admin({ onEventCreated }) {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showUsers, setShowUsers] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    venue: "",
    image: "",
    isPaid: false,
    price: 0,
    paymentMethods: ["stripe"],
    capacity: null,
    waitlistEnabled: false
  });

  const loadData = async () => {
    try {
      setIsRefreshing(true);
      const [eventsRes, usersRes, registrationsRes] = await Promise.all([
        fetchEvents(),
        fetchUsers(),
        fetchAllRegistrations()
      ]);

      const eventsData = eventsRes.data.map((event) => ({ ...event, id: event.id }));
      const usersData = usersRes.data.map((user) => ({ ...user, id: user.id }));
      
      const registrationsData = registrationsRes.data.map((registration) => {
        const user = usersData.find((u) => u.id === registration.userId);
        return {
          ...registration,
          id: registration.id,
          user: user,
          event: registration.eventId
        };
      });

      setEvents(eventsData);
      setUsers(usersData);
      setRegistrations(registrationsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 2 seconds
    const interval = setInterval(() => {
      loadData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddEvent = async () => {
    if (!form.title || !form.description || !form.date || !form.venue) {
      alert("Fill all required fields");
      return;
    }

    if (form.isPaid && (!form.price || form.price <= 0)) {
      alert("Please set a valid price for paid events");
      return;
    }

    if (form.capacity && form.capacity <= 0) {
      alert("Capacity must be greater than 0");
      return;
    }

    try {
      const response = await addEvent(form);
      setEvents((prev) => [...prev, { ...response.data, id: response.data.id }]);
      setForm({
        title: "",
        description: "",
        category: "Technical",
        date: "",
        venue: "",
        image: "",
        isPaid: false,
        price: 0,
        paymentMethods: ["stripe"],
        capacity: null,
        waitlistEnabled: false
      });
      if (onEventCreated) {
        onEventCreated({ ...response.data, id: response.data.id });
      }
      alert("Event created successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save event");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      venue: event.venue,
      image: event.image || "",
      isPaid: event.isPaid || false,
      price: event.price || 0,
      paymentMethods: event.paymentMethods || ["stripe"],
      capacity: event.capacity || null,
      waitlistEnabled: event.waitlistEnabled || false
    });
  };

  const handleUpdateEvent = async () => {
    if (!form.title || !form.description || !form.date || !form.venue) {
      alert("Fill all required fields");
      return;
    }

    if (form.isPaid && (!form.price || form.price <= 0)) {
      alert("Please set a valid price for paid events");
      return;
    }

    if (form.capacity && form.capacity <= 0) {
      alert("Capacity must be greater than 0");
      return;
    }

    try {
      const response = await updateEvent(editingEvent.id, form);
      setEvents((prev) => prev.map(event =>
        event.id === editingEvent.id ? { ...response.data, id: response.data.id } : event
      ));
      setEditingEvent(null);
      setForm({
        title: "",
        description: "",
        category: "Technical",
        date: "",
        venue: "",
        image: "",
        isPaid: false,
        price: 0,
        paymentMethods: ["stripe"],
        capacity: null,
        waitlistEnabled: false
      });
      alert("Event updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter(event => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete event");
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      category: "Technical",
      date: "",
      venue: "",
      image: "",
      isPaid: false,
      price: 0,
      paymentMethods: ["stripe"],
      capacity: null,
      waitlistEnabled: false
    });
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      await loadData();
    } catch {
      alert("Unable to block user.");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId);
      await loadData();
    } catch {
      alert("Unable to unblock user.");
    }
  };

  const blockedUsers = users.filter((user) => user.blocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel 🛠️</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            <p>Last refresh: {lastRefresh.toLocaleTimeString()}</p>
            <p className="flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
              {isRefreshing ? 'Refreshing...' : '✓ Live data'}
            </p>
          </div>
          <button
            onClick={() => loadData()}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowUsers(!showUsers)}
        className="w-full bg-blue-600 p-3 rounded-xl mb-2"
      >
        Users 👥 ▼
      </button>
      {showUsers && (
        <div className="mb-4 space-y-2">
          {users.map((user) => (
            <div key={user.id} className="bg-white/10 p-3 rounded flex justify-between">
              <span>
                {user.name} ({user.email})
              </span>
              {!user.blocked && (
                <button
                  onClick={() => handleBlockUser(user.id)}
                  className="bg-red-500 px-2 py-1 rounded"
                >
                  Block
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowBlocked(!showBlocked)}
        className="w-full bg-red-600 p-3 rounded-xl mb-2"
      >
        Blocked Users 🚫 ▼
      </button>
      {showBlocked && (
        <div className="mb-4 space-y-2">
          {blockedUsers.map((user) => (
            <div key={user.id} className="bg-red-900/40 p-3 rounded flex justify-between">
              <span>{user.email}</span>
              <button
                onClick={() => handleUnblockUser(user.id)}
                className="bg-green-500 px-2 py-1 rounded"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowRegistrations(!showRegistrations)}
        className="w-full bg-green-600 p-3 rounded-xl mb-2"
      >
        Event Registrations 🎟️ ▼
      </button>
      {showRegistrations && (
        <div className="mb-6 space-y-3">
          {events.map((event) => {
            const usersForEvent = registrations.filter(
              (registration) => registration.event && registration.event.id === event.id
            );

            return (
              <div key={event.id} className="bg-white/10 p-4 rounded">
                <h3 className="font-bold">{event.title}</h3>

                {usersForEvent.length === 0 ? (
                  <p className="text-gray-400">No registrations</p>
                ) : (
                  usersForEvent.map((registration) => (
                    <div key={registration.id} className="bg-gray-800 p-2 mt-2 rounded">
                      {registration.user?.email}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
          <h2 className="mb-4">{editingEvent ? "Edit Event" : "Add Event"}</h2>

          <input
            placeholder="Title"
            className="w-full mb-3 p-3 rounded bg-gray-800"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="w-full mb-3 p-3 rounded bg-gray-800"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="w-full mb-3 p-3 rounded bg-gray-800"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Technical</option>
            <option>Workshop</option>
            <option>Sports</option>
            <option>Cultural</option>
          </select>

          <input
            type="date"
            placeholder="Date"
            className="w-full mb-3 p-3 rounded bg-gray-800"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            placeholder="Venue"
            className="w-full mb-3 p-3 rounded bg-gray-800"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />

          {/* Paid Event Settings */}
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Event Pricing & Capacity</h3>

            {/* Is Paid Event */}
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="isPaid"
                checked={form.isPaid}
                onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                className="w-4 h-4 accent-purple-500 mr-3"
              />
              <label htmlFor="isPaid" className="text-sm font-medium">
                This is a paid event 💰
              </label>
            </div>

            {/* Price Input */}
            {form.isPaid && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter price in rupees"
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            {/* Payment Methods */}
            {form.isPaid && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Payment Methods</label>
                <div className="space-y-2">
                  {["stripe", "paypal", "upi", "offline"].map(method => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.paymentMethods.includes(method)}
                        onChange={(e) => {
                          const updatedMethods = e.target.checked
                            ? [...form.paymentMethods, method]
                            : form.paymentMethods.filter(m => m !== method);
                          setForm({ ...form, paymentMethods: updatedMethods });
                        }}
                        className="w-4 h-4 accent-purple-500 mr-3"
                      />
                      <span className="text-sm capitalize">{method === "upi" ? "UPI" : method}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity Settings */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">Capacity (leave empty for unlimited)</label>
              <input
                type="number"
                placeholder="Maximum number of participants"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none"
                value={form.capacity || ""}
                onChange={(e) => setForm({ ...form, capacity: e.target.value ? parseInt(e.target.value) : null })}
                min="1"
              />
            </div>

            {/* Waitlist */}
            {form.capacity && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="waitlistEnabled"
                  checked={form.waitlistEnabled}
                  onChange={(e) => setForm({ ...form, waitlistEnabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 mr-3"
                />
                <label htmlFor="waitlistEnabled" className="text-sm font-medium">
                  Enable waitlist when capacity is full ⏳
                </label>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="bg-gray-800 px-4 py-2 rounded-xl"
            >
              📎 Attach
            </button>

            {showUploadMenu && (
              <div className="absolute mt-2 bg-gray-900 p-3 rounded-xl">
                <label className="cursor-pointer">
                  📸 Upload Image
                  <input type="file" hidden onChange={handleImage} />
                </label>
              </div>
            )}
          </div>

          <button
            onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl"
          >
            {editingEvent ? "Update Event" : "Save Event"}
          </button>

          {editingEvent && (
            <button
              onClick={handleCancelEdit}
              className="mt-2 w-full bg-gray-600 py-3 rounded-xl"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
          <h2>Preview</h2>

          <div className="bg-gray-900 rounded-xl overflow-hidden mt-3">
            {form.image && (
              <img src={form.image} className="w-full h-40 object-cover" />
            )}

            <div className="p-4">
              <h2>{form.title || "Event Title"}</h2>
              <p className="text-gray-400 text-sm">{form.description || "Description"}</p>
              <p className="text-purple-400 text-sm mt-2">{form.category}</p>
              <p className="text-sm mt-2">📅 {form.date || "Date"}</p>
              <p className="text-sm">📍 {form.venue || "Venue"}</p>

              {/* Paid Event Preview */}
              {form.isPaid && (
                <div className="mt-3 p-2 bg-green-600/20 rounded border border-green-500/30">
                  <p className="text-green-400 text-sm font-semibold">💰 Paid Event - ₹{form.price}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Payment Methods: {form.paymentMethods.map(m => m === "upi" ? "UPI" : m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                  </p>
                </div>
              )}

              {/* Capacity Preview */}
              {form.capacity && (
                <div className="mt-2 p-2 bg-blue-600/20 rounded border border-blue-500/30">
                  <p className="text-blue-400 text-sm">
                    👥 Capacity: {form.capacity}
                    {form.waitlistEnabled && " (Waitlist enabled)"}
                  </p>
                </div>
              )}

              {/* Free Event Badge */}
              {!form.isPaid && (
                <div className="mt-2 p-2 bg-blue-600/20 rounded border border-blue-500/30">
                  <p className="text-blue-400 text-sm">🆓 Free Event</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Events List Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
        <h2 className="mb-4">Manage Events ({events.length})</h2>

        {events.length === 0 ? (
          <p className="text-gray-400">No events created yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">{event.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>📍 {event.venue}</span>
                      <span>🏷️ {event.category}</span>
                      {event.isPaid ? (
                        <span className="text-green-400">💰 ₹{event.price}</span>
                      ) : (
                        <span className="text-blue-400">🆓 Free</span>
                      )}
                      <span className="text-cyan-400">👥 Registrations: {event.currentRegistrations || 0}{event.capacity ? `/${event.capacity}` : ""}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
