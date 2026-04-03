import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    venue: "",
    image: ""
  });

  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem("events")) || []);
    setUsers(JSON.parse(localStorage.getItem("users")) || []);
    setRegistrations(JSON.parse(localStorage.getItem("userRegistrations")) || {});
    setBlockedUsers(JSON.parse(localStorage.getItem("blockedUsers")) || []);
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

  // ➕ ADD EVENT
  const handleAddEvent = () => {
    if (!form.title || !form.description || !form.date || !form.venue) {
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
      category: "Technical",
      date: "",
      venue: "",
      image: ""
    });
  };

  // 🚫 BLOCK USER
  const handleBlockUser = (email) => {
    const updatedBlocked = [...blockedUsers, email];
    const updatedUsers = users.filter(u => u.email !== email);

    const updatedRegs = { ...registrations };
    delete updatedRegs[email];

    localStorage.setItem("blockedUsers", JSON.stringify(updatedBlocked));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("userRegistrations", JSON.stringify(updatedRegs));

    setBlockedUsers(updatedBlocked);
    setUsers(updatedUsers);
    setRegistrations(updatedRegs);
  };

  // ✅ UNBLOCK
  const handleUnblockUser = (email) => {
    const updated = blockedUsers.filter(u => u !== email);
    localStorage.setItem("blockedUsers", JSON.stringify(updated));
    setBlockedUsers(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black p-6 text-white">

      <h1 className="text-3xl mb-6 font-bold">Admin Panel 🛠️</h1>

      {/* 👥 USERS DROPDOWN */}
      <button onClick={() => setShowUsers(!showUsers)} className="w-full bg-blue-600 p-3 rounded-xl mb-2">
        Users 👥 ▼
      </button>
      {showUsers && (
        <div className="mb-4 space-y-2">
          {users.map(user => (
            <div key={user.email} className="bg-white/10 p-3 rounded flex justify-between">
              <span>{user.name} ({user.email})</span>
              <button onClick={() => handleBlockUser(user.email)} className="bg-red-500 px-2 py-1 rounded">
                Block
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🚫 BLOCKED USERS */}
      <button onClick={() => setShowBlocked(!showBlocked)} className="w-full bg-red-600 p-3 rounded-xl mb-2">
        Blocked Users 🚫 ▼
      </button>
      {showBlocked && (
        <div className="mb-4 space-y-2">
          {blockedUsers.map(email => (
            <div key={email} className="bg-red-900/40 p-3 rounded flex justify-between">
              <span>{email}</span>
              <button onClick={() => handleUnblockUser(email)} className="bg-green-500 px-2 py-1 rounded">
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🎟 REGISTRATIONS DROPDOWN */}
      <button onClick={() => setShowRegistrations(!showRegistrations)} className="w-full bg-green-600 p-3 rounded-xl mb-2">
        Event Registrations 🎟️ ▼
      </button>

      {showRegistrations && (
        <div className="mb-6 space-y-3">
          {events.map(event => {
            const usersForEvent = Object.entries(registrations)
              .filter(([email, evts]) =>
                evts.some(e => e.id === event.id)
              );

            return (
              <div key={event.id} className="bg-white/10 p-4 rounded">
                <h3 className="font-bold">{event.title}</h3>

                {usersForEvent.length === 0 ? (
                  <p className="text-gray-400">No registrations</p>
                ) : (
                  usersForEvent.map(([email]) => (
                    <div key={email} className="bg-gray-800 p-2 mt-2 rounded">
                      {email}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✨ ADD EVENT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
          <h2 className="mb-4">Add Event</h2>

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

          {/* 📎 ATTACH */}
          <div className="relative">
            <button onClick={() => setShowUploadMenu(!showUploadMenu)} className="bg-gray-800 px-4 py-2 rounded-xl">
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
            onClick={handleAddEvent}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-xl"
          >
            Save Event
          </button>
        </div>

        {/* 👀 PREVIEW */}
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}