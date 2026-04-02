import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [registered, setRegistered] = useState([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setRegistered([]);
  };

  const handleRegisterEvent = (event) => {
    if (!registered.find(e => e.id === event.id)) {
      setRegistered([...registered, event]);
    } else {
      alert("Already registered!");
    }
  };

  // If not logged in → show Auth
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between p-4 bg-black text-white">
        
        <h1 className="text-xl font-bold">UniSphere</h1>

        <div className="flex items-center gap-4">
          <span>{user.name}</span>

          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {page === "home" ? (
        <LandingPage onRegister={handleRegisterEvent} />
      ) : (
        <Dashboard registered={registered} />
      )}
    </div>
  );
}

export default App;