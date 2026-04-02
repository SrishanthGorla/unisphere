import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [registered, setRegistered] = useState([]);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Load user + registrations
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedRegistered =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    if (storedUser) setUser(storedUser);
    setRegistered(storedRegistered);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setRegistered([]);
  };

  // ✅ REGISTER EVENT (UPDATED WITH STORAGE)
  const handleRegisterEvent = (event) => {
    const exists = registered.find(e => e.id === event.id);

    if (!exists) {
      const updated = [...registered, event];

      setRegistered(updated);

      // 🔥 SAVE FOR ADMIN ANALYTICS
      localStorage.setItem(
        "registeredEvents",
        JSON.stringify(updated)
      );
    }
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div
      className={
        dark
          ? "bg-gray-950 text-white min-h-screen"
          : "bg-white text-black min-h-screen"
      }
    >
      {/* NAVBAR */}
      <div className="flex justify-between items-center p-4 bg-black text-white relative">
        <h1 className="text-xl font-bold">UniSphere</h1>

        {/* LEFT NAV */}
        <div className="flex gap-4">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>

          {/* ADMIN QUICK ACCESS */}
          {user.role === "admin" && (
            <button onClick={() => setPage("admin")}>
              Admin
            </button>
          )}
        </div>

        {/* HAMBURGER MENU */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-xl shadow-lg p-3 flex flex-col gap-2 z-50">
              
              <span className="text-sm text-gray-300">
                👤 {user.name}
              </span>

              <button
                onClick={() => {
                  setPage("profile");
                  setMenuOpen(false);
                }}
                className="text-left hover:bg-gray-700 p-2 rounded"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setPage("contact");
                  setMenuOpen(false);
                }}
                className="text-left hover:bg-gray-700 p-2 rounded"
              >
                Contact
              </button>

              {/* ADMIN PANEL */}
              {user.role === "admin" && (
                <button
                  onClick={() => {
                    setPage("admin");
                    setMenuOpen(false);
                  }}
                  className="text-left hover:bg-blue-600 p-2 rounded"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => setDark(!dark)}
                className="text-left hover:bg-gray-700 p-2 rounded"
              >
                {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left hover:bg-red-500 p-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PAGE TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {page === "home" && (
            <LandingPage onRegister={handleRegisterEvent} />
          )}

          {page === "dashboard" && (
            <Dashboard registered={registered} />
          )}

          {page === "profile" && (
            <Profile user={user} setUser={setUser} />
          )}

          {page === "contact" && <Contact />}

          {/* ADMIN PAGE */}
          {page === "admin" && user.role === "admin" && (
            <Admin />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;