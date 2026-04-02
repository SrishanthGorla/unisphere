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

  // LOAD DATA
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

  // ADD / UPDATE EVENT
  const handleAddOrUpdate = () => {
    if (!form.title || !form.description) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      // UPDATE
      const updated = events.map(e =>
        e.id === editingId ? { ...e, ...form } : e
      );

      saveEvents(updated);
      setEditingId(null);
    } else {
      // ADD
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

  // EDIT
  const handleEdit = (event) => {
    setForm(event);
    setEditingId(event.id);
  };

  // DELETE
  const handleDelete = (id) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      
      <h1 className="text-3xl mb-6">Admin Dashboard 🛠️</h1>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        
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

      {/* ➕ ADD / EDIT FORM */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h2 className="mb-3">
          {editingId ? "Edit Event ✏️" : "Add Event ➕"}
        </h2>

        <input
          placeholder="Title"
          className="w-full mb-2 p-2 rounded text-black"
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
        />

        <input
          placeholder="Description"
          className="w-full mb-2 p-2 rounded text-black"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
        />

        <input
          placeholder="Category"
          className="w-full mb-2 p-2 rounded text-black"
          value={form.category}
          onChange={(e) => setForm({...form, category: e.target.value})}
        />

        <input
          placeholder="Date (e.g. Feb 12 2026)"
          className="w-full mb-2 p-2 rounded text-black"
          value={form.date}
          onChange={(e) => setForm({...form, date: e.target.value})}
        />

        <input
          placeholder="Venue"
          className="w-full mb-3 p-2 rounded text-black"
          value={form.venue}
          onChange={(e) => setForm({...form, venue: e.target.value})}
        />

        <button
          onClick={handleAddOrUpdate}
          className="bg-green-500 px-4 py-2 rounded"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </div>

      {/* 📋 EVENT LIST */}
      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-white/10 p-4 rounded-xl flex justify-between items-center"
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