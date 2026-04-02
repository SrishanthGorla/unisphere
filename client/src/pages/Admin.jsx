import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    venue: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(stored);
  }, []);

  const saveEvents = (updated) => {
    localStorage.setItem("events", JSON.stringify(updated));
    setEvents(updated);
  };

  const handleAdd = () => {
    if (!form.title || !form.description) {
      alert("Fill all fields");
      return;
    }

    const newEvent = {
      id: Date.now(),
      ...form
    };

    saveEvents([...events, newEvent]);

    setForm({
      title: "",
      description: "",
      category: "",
      date: "",
      venue: ""
    });
  };

  const handleDelete = (id) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      
      <h1 className="text-3xl mb-6">Admin Panel 🛠️</h1>

      {/* ADD EVENT */}
      <div className="bg-white/10 p-6 rounded-xl mb-6">
        <h2 className="mb-3">Add Event</h2>

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
          placeholder="Date"
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
          onClick={handleAdd}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      {/* EVENT LIST */}
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white/10 p-4 rounded-xl flex justify-between">
            <div>
              <h2>{event.title}</h2>
              <p className="text-sm text-gray-400">{event.date}</p>
            </div>

            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}