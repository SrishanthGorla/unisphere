import { useState } from "react";

export default function EventCard({ event, onRegister }) {
  const [liked, setLiked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill all details");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Enter valid email");
      return;
    }

    if (formData.phone.length < 10) {
      alert("Enter valid phone");
      return;
    }

    onRegister({ ...event, user: formData });

    setShowForm(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 text-white">
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>

          <button onClick={() => setLiked(!liked)}>
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        <p className="text-gray-300 mt-2">{event.description}</p>

        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-xl"
        >
          Register
        </button>
      </div>

      {/* MODAL FIXED */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            
            <h2 className="text-xl text-white mb-4 text-center">
              Register for {event.title}
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full mb-3 p-2 rounded text-black"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 rounded text-black"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              className="w-full mb-4 p-2 rounded text-black"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-green-500 flex-1 py-2 rounded"
              >
                Submit
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-red-500 flex-1 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Registered Successfully 🎉
        </div>
      )}
    </>
  );
}