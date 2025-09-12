// src\pages\Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { loginUser } from "../utils/api";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ identifier, password });

      // Save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch login to Redux
      dispatch(loginSuccess({ user: data.user, token: data.token }));

      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="mb-6 text-sm small-muted max-w-md">
        Step back into <span className="brand">Digital Quill</span> — where stories, ideas, 
        and voices come alive.
      </p>

      <form onSubmit={handleSubmit} className="card max-w-md w-full">
        <h2 className="text-2xl mb-4 brand">Login</h2>

        <input
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Username"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />

        <div className="relative mb-2">
          <input
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm small-muted"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Link
            to="/forgot-password"
            className="text-sm text-[#6a4e2c] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button className="btn btn-primary w-full" type="submit">
          Login
        </button>

        <p className="text-sm mt-4 text-center small-muted">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#6a4e2c] hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
