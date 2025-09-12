import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api";
import { loginSuccess } from "../redux/authSlice";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const { data } = await registerUser({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      // Save token & user in localStorage (authSlice also saves)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch login to Redux immediately after registration
      dispatch(loginSuccess({ user: data.user, token: data.token }));

      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Warm message */}
      <p className="mb-6 text-sm small-muted max-w-md">
        Join <span className="brand">Digital Quill</span> today — a place where your ideas, stories, and creativity can take flight ✨
      </p>

      <form onSubmit={handleSubmit} className="card max-w-md w-full">
        <h2 className="text-2xl mb-4 brand">Create Account</h2>

        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <input
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />

        <div className="relative mb-3">
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

        <div className="relative mb-4">
          <input
            required
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm small-muted"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <button className="btn btn-primary w-full" type="submit">
          Register
        </button>

        <p className="text-sm mt-4 text-center small-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6a4e2c] hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
