import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [registered, setRegistered] = useState([]);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setRegistered([]);
  };

  const handleRegisterEvent = (event) => {
    if (!registered.find(e => e.id === event.id)) {
      setRegistered([...registered, event]);
    }
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className={dark ? "bg-gray-950 text-white" : "bg-white text-black"}>
      
      {/* NAVBAR */}
      <div className="flex justify-between p-4 bg-black text-white">
        <h1 className="text-xl font-bold">UniSphere</h1>

        <div className="flex items-center gap-4">
          <span>{user.name}</span>

          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("profile")}>Profile</button>

          <button
            onClick={() => setDark(!dark)}
            className="bg-purple-600 px-3 py-1 rounded"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;