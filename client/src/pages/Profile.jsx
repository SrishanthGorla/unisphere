import { useState, useEffect } from "react";

export default function Profile({ user, setUser }) {
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: ""
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || ""
      });
    }
  }, [user]);

  const handleSave = () => {
    const updatedUser = { ...user, ...form };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      
      <h1 className="text-3xl mb-6">My Profile 👤</h1>

      <div className="bg-white/10 p-6 rounded-2xl max-w-md">
        
        {edit ? (
          <>
            <input
              type="text"
              value={form.name}
              className="w-full mb-3 p-2 rounded text-black"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              value={form.email}
              className="w-full mb-3 p-2 rounded text-black"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              className="w-full mb-3 p-2 rounded text-black"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="College"
              value={form.college}
              className="w-full mb-4 p-2 rounded text-black"
              onChange={(e) =>
                setForm({ ...form, college: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-500 flex-1 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEdit(false)}
                className="bg-red-500 flex-1 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone || "Not added"}</p>
            <p><b>College:</b> {user.college || "Not added"}</p>

            <button
              onClick={() => setEdit(true)}
              className="mt-4 bg-purple-600 px-4 py-2 rounded w-full"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}