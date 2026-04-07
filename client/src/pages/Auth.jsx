import { useState } from "react";
import { loginUser, registerUser } from "../api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Enter valid email");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });
      alert("Registered successfully!");
      setIsLogin(true);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password
      });

      const user = response.data;
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-purple-950 px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-sm text-white shadow-xl">
        <h1 className="text-2xl mb-4 text-center font-bold">
          {isLogin ? "Login 🔐" : "Register 📝"}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-2 rounded bg-white text-black"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-white text-black"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          className="w-full mb-4 p-2 rounded bg-white text-black"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded font-semibold"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {isLogin && window.location.hostname === "localhost" && (
          <p className="mt-3 text-xs text-center text-gray-400">
            Admin: admin@gmail.com / admin123
          </p>
        )}

        <p
          className="mt-4 text-center cursor-pointer text-sm text-gray-300 hover:text-white"
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
