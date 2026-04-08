import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { fetchRegistrations, registerEvent } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [registered, setRegistered] = useState([]);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventRefreshKey, setEventRefreshKey] = useState(0);

  const loadRegistrations = async (userId) => {
    try {
      const response = await fetchRegistrations(userId);
      const registeredEvents = response.data.map((registration) => {
        const event = registration.eventId || {};
        return {
          ...registration,
          eventId: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          venue: event.venue,
          coordinator: event.coordinator,
          inspector: event.inspector,
          category: event.category,
          image: event.image,
          isPaid: event.isPaid,
          price: event.price,
          capacity: event.capacity,
          waitlistEnabled: event.waitlistEnabled,
          currentRegistrations: event.currentRegistrations,
          averageRating: event.averageRating,
          totalReviews: event.totalReviews
        };
      });
      setRegistered(registeredEvents);
    } catch (error) {
      console.error(error);
      setRegistered([]);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(storedUser);
      loadRegistrations(storedUser.id);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    loadRegistrations(userData.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setRegistered([]);
    setPage("home");
  };

  const handleRegisterEvent = async (event) => {
    if (!user) {
      alert("Please log in to register for an event.");
      return;
    }

    if (!event || !event.id) {
      alert("Event information is missing. Please refresh the page.");
      return;
    }

    try {
      const payload = {
        userId: user.id,
        eventId: event.id,
        eventTitle: event.title
      };
      
      if (!payload.userId || !payload.eventId || !payload.eventTitle) {
        alert("Registration data is incomplete. Please refresh and try again.");
        return;
      }

      await registerEvent(payload);
      await loadRegistrations(user.id);
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      alert(message);
    }
  };

  const handleEventCreated = () => {
    setEventRefreshKey(prev => prev + 1);
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
      {/* Enhanced Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  UniSphere
                </span>
              </div>

              {/* Breadcrumb Navigation */}
              <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <span>Home</span>
                {page !== "home" && (
                  <>
                    <span>/</span>
                    <span className="text-purple-400 capitalize">{page}</span>
                  </>
                )}
              </nav>
            </div>

            {/* Main Navigation */}
            {user && (
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setPage("home")}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    page === "home"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  🏠 Home
                </button>
                <button
                  onClick={() => setPage("dashboard")}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    page === "dashboard"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setPage("profile")}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    page === "profile"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  👤 Profile
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => setPage("admin")}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      page === "admin"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    ⚙️ Admin
                  </button>
                )}
              </nav>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title={dark ? "Light Mode" : "Dark Mode"}
              >
                {dark ? "☀️" : "🌙"}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-sm">{user.name}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg p-3 flex flex-col gap-2 z-50 border border-white/10">
                      <div className="px-3 py-2 border-b border-white/10">
                        <span className="text-sm text-gray-300">👤 {user.name}</span>
                        <span className="text-xs text-gray-500 block">{user.email}</span>
                      </div>

                      <button
                        onClick={() => {
                          setPage("profile");
                          setMenuOpen(false);
                        }}
                        className="text-left hover:bg-gray-700 p-2 rounded flex items-center space-x-2"
                      >
                        <span>👤</span>
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setPage("contact");
                          setMenuOpen(false);
                        }}
                        className="text-left hover:bg-gray-700 p-2 rounded flex items-center space-x-2"
                      >
                        <span>📞</span>
                        <span>Contact</span>
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            setPage("admin");
                            setMenuOpen(false);
                          }}
                          className="text-left hover:bg-blue-600 p-2 rounded flex items-center space-x-2"
                        >
                          <span>⚙️</span>
                          <span>Admin Panel</span>
                        </button>
                      )}

                      <div className="border-t border-white/10 my-1"></div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="text-left hover:bg-red-500 p-2 rounded flex items-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setPage("auth")}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              {user && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  ☰
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div>
        {page === "home" && <LandingPage onRegister={handleRegisterEvent} eventRefreshKey={eventRefreshKey} />}
        {page === "dashboard" && <Dashboard registered={registered} user={user} />}
        {page === "profile" && <Profile user={user} setUser={setUser} registered={registered} />}
        {page === "contact" && <Contact />}
        {page === "admin" && user.role === "admin" && <Admin onEventCreated={handleEventCreated} />}
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  UniSphere
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting students with amazing events and opportunities at SR University.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">📘</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">🐦</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">📷</a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">💼</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setPage("home")} className="text-gray-400 hover:text-purple-400 transition-colors">Home</button></li>
                <li><button onClick={() => setPage("dashboard")} className="text-gray-400 hover:text-purple-400 transition-colors">Dashboard</button></li>
                <li><button onClick={() => setPage("contact")} className="text-gray-400 hover:text-purple-400 transition-colors">Contact</button></li>
                <li><button onClick={() => setPage("about")} className="text-gray-400 hover:text-purple-400 transition-colors">About Us</button></li>
              </ul>
            </div>

            {/* Event Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">Event Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Technical Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cultural Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Sports Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Workshops</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 unisphere@gmail.com</li>
                <li>📞 +91 9876543210</li>
                <li>📍 SR University Campus</li>
                <li>🕒 Mon-Fri: 9AM-6PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 UniSphere. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => setPage("privacy")} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Privacy Policy</button>
              <button onClick={() => setPage("terms")} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Terms of Service</button>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
