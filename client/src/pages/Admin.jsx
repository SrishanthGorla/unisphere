import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false); // ✅ NEW

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    venue: "",
    image: ""
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

  // 📸 IMAGE UPLOAD
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ➕ ADD / UPDATE
  const handleAddOrUpdate = () => {
    if (!form.title || !form.description || !form.date) {
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
      category: "Technical",
      date: "",
      venue: "",
      image: ""
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
        <div className="bg-purple-600 p-4 rounded-xl text-center">
          <p>Total Users</p>
          <h2 className="text-3xl font-bold">{users.length}</h2>
        </div>

        <div className="bg-blue-600 p-4 rounded-xl text-center">
          <p>Total Events</p>
          <h2 className="text-3xl font-bold">{events.length}</h2>
        </div>

        <div className="bg-green-600 p-4 rounded-xl text-center">
          <p>Registrations</p>
          <h2 className="text-3xl font-bold">
            {JSON.parse(localStorage.getItem("registeredEvents"))?.length || 0}
          </h2>
        </div>
      </div>

      {/* FORM + PREVIEW */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
          <h2 className="mb-4 font-semibold">
            {editingId ? "Edit Event ✏️" : "Create Event ➕"}
          </h2>

          <input
            placeholder="Event Title"
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

          {/* CATEGORY */}
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

          {/* 📎 WHATSAPP STYLE UPLOAD */}
          <div className="relative mt-3">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700"
            >
              📎 Attach
            </button>

            {showUploadMenu && (
              <div className="absolute mt-2 bg-gray-900 p-3 rounded-xl shadow-lg flex flex-col gap-2 z-50">
                
                <label className="cursor-pointer hover:bg-gray-700 p-2 rounded">
                  📸 Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleImage(e);
                      setShowUploadMenu(false);
                    }}
                  />
                </label>

                <label className="cursor-pointer hover:bg-gray-700 p-2 rounded">
                  📄 Upload File
                  <input
                    type="file"
                    className="hidden"
                    onChange={() => alert("File upload demo")}
                  />
                </label>

              </div>
            )}
          </div>

          <button
            onClick={handleAddOrUpdate}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl"
          >
            {editingId ? "Update Event" : "Add Event"}
          </button>
        </div>

        {/* LIVE PREVIEW */}
        <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
          <h2 className="mb-4">Live Preview 👀</h2>

          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {form.image && (
              <img src={form.image} className="w-full h-40 object-cover" />
            )}

            <div className="p-4">
              <h2>{form.title || "Event Title"}</h2>
              <p className="text-gray-400 text-sm">
                {form.description || "Description..."}
              </p>

              <p className="text-purple-400 text-sm mt-2">
                {form.category}
              </p>

              <p className="text-sm mt-2">📅 {form.date || "Date"}</p>
              <p className="text-sm">📍 {form.venue || "Venue"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-white/10 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2>{event.title}</h2>
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