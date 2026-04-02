import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    venue: ""
  });

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    setEvents(storedEvents);
    setUsers(storedUsers);
  }, []);

  const saveEvents = (updated) => {
    localStorage.setItem("events", JSON.stringify(updated));
    setEvents(updated);
  };

  const handleAddOrUpdate = () => {
    if (!form.title || !form.description) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      const updated = events.map(e =>
        e.id === editingId ? { ...e, ...form } : e
      );
      saveEvents(updated);
      setEditingId(null);
    } else {
      const newEvent = {
        id: Date.now(),
        ...form
      };
      saveEvents([...events, newEvent]);
    }

    setForm({
      title: "",
      description: "",
      category: "",
      date: "",
      venue: ""
    });
  };

  const handleEdit = (event) => {
    setForm(event);
    setEditingId(event.id);
  };

  const handleDelete = (id) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-6 text-white">
      
      <h1 className="text-3xl mb-6 font-bold">Admin Dashboard 🛠️</h1>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-600 p-4 rounded-xl">
          <h2>Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-blue-600 p-4 rounded-xl">
          <h2>Total Events</h2>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>

        <div className="bg-green-600 p-4 rounded-xl">
          <h2>Registrations</h2>
          <p className="text-2xl font-bold">
            {JSON.parse(localStorage.getItem("registeredEvents"))?.length || 0}
          </p>
        </div>
      </div>

      {/* ✨ ADD / EDIT FORM */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl mb-8 shadow-xl">
        
        <h2 className="text-xl mb-4 font-semibold">
          {editingId ? "✏️ Edit Event" : "➕ Create New Event"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          
          <input
            placeholder="🎯 Event Title"
            className="p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="📂 Category (Technical, Sports...)"
            className="p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            placeholder="📅 Date (e.g. Feb 12 2026)"
            className="p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            placeholder="📍 Venue"
            className="p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
        </div>

        <textarea
          placeholder="📝 Description"
          className="w-full mt-4 p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={handleAddOrUpdate}
          className="mt-5 w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </div>

      {/* 📋 EVENT LIST */}
      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-white/10 p-4 rounded-xl flex justify-between items-center border border-white/20"
          >
            <div>
              <h2 className="font-bold">{event.title}</h2>
              <p className="text-sm text-gray-400">{event.date}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}