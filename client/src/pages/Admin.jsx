import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const [registrations, setRegistrations] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);

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

  // ➕ ADD / UPDATE EVENT
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

  // 🚫 BLOCK USER
  const handleBlockUser = (email) => {
    if (blockedUsers.includes(email)) return;

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

  // ✅ UNBLOCK USER
  const handleUnblockUser = (email) => {
    const updatedBlocked = blockedUsers.filter(u => u !== email);
    localStorage.setItem("blockedUsers", JSON.stringify(updatedBlocked));
    setBlockedUsers(updatedBlocked);
  };

  // 📊 TOTAL REGISTRATIONS COUNT
  const totalRegistrations = Object.values(registrations).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

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
          <h2 className="text-3xl font-bold">{totalRegistrations}</h2>
        </div>
      </div>

      {/* 👥 USERS */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Users 👥</h2>

        {users.map(user => (
          <div key={user.email} className="bg-white/10 p-3 mb-2 rounded flex justify-between">
            <span>{user.name} ({user.email})</span>

            <button
              onClick={() => handleBlockUser(user.email)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Block
            </button>
          </div>
        ))}
      </div>

      {/* 🚫 BLOCKED USERS */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Blocked Users 🚫</h2>

        {blockedUsers.map(email => (
          <div key={email} className="bg-red-900/40 p-3 mb-2 rounded flex justify-between">
            <span>{email}</span>

            <button
              onClick={() => handleUnblockUser(email)}
              className="bg-green-500 px-3 py-1 rounded"
            >
              Unblock
            </button>
          </div>
        ))}
      </div>

      {/* 🎟 EVENT REGISTRATIONS */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Event Registrations 🎟️</h2>

        {events.map(event => {
          const usersForEvent = Object.entries(registrations)
            .filter(([email, evts]) =>
              evts.some(e => e.id === event.id)
            );

          return (
            <div key={event.id} className="bg-white/10 p-4 mb-4 rounded">
              <h3 className="font-bold">{event.title}</h3>

              {usersForEvent.length === 0 ? (
                <p className="text-gray-400">No registrations</p>
              ) : (
                usersForEvent.map(([email]) => (
                  <div key={email} className="flex justify-between bg-gray-800 p-2 mt-2 rounded">
                    <span>{email}</span>

                    <button
                      onClick={() => handleBlockUser(email)}
                      className="bg-red-500 px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* FORM + PREVIEW (UNCHANGED UI) */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div className="bg-white/10 p-6 rounded-2xl">
          <h2>{editingId ? "Edit Event" : "Add Event"}</h2>

          <input
            placeholder="Title"
            className="w-full mb-2 p-2 text-black"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="w-full mb-2 p-2 text-black"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button
            onClick={handleAddOrUpdate}
            className="bg-green-500 px-4 py-2"
          >
            Save Event
          </button>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl">
          <h2>Preview</h2>
          <p>{form.title}</p>
        </div>

      </div>

      {/* EVENT LIST */}
      <div>
        {events.map(event => (
          <div key={event.id} className="bg-white/10 p-3 mb-2 flex justify-between">
            <span>{event.title}</span>

            <div>
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}