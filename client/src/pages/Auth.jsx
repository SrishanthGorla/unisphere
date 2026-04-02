import { useState, useEffect } from "react";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const existing = users.find(u => u.email === form.email);

    if (existing) {
      alert("User already exists");
      return;
    }

    const updatedUsers = [...users, form];
    saveUsers(updatedUsers);

    alert("Registered successfully!");
    setIsLogin(true);
  };

  const handleLogin = () => {
    const user = users.find(
      u => u.email === form.email && u.password === form.password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-purple-950 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-sm text-white">
        
        <h1 className="text-2xl mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-2 rounded text-black"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded text-black"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          className="w-full mb-4 p-2 rounded text-black"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-purple-600 py-2 rounded"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="mt-4 text-center cursor-pointer text-sm text-gray-300"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}