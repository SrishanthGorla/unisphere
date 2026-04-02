import { useState } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  const handleLogin = () => {
    if (!user.name || !user.email) {
      alert("Please fill all fields");
      return;
    }

    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-purple-950">
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-80 text-white">
        <h1 className="text-2xl mb-4 text-center">Login</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 rounded text-black"
          onChange={(e) =>
            setUser({ ...user, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded text-black"
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}