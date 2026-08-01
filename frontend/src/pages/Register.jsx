import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import API from "../lib/api";
import { toast } from 'sonner';

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/register", { name, email, password });
      const data = res.data;

      if (data.token && data.user) {
        toast.success("Welcome! Your account is ready.");
        login({ email: data.user.email, password });
        navigate("/dashboard");
      } else {
        toast.success("Registered successfully, please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const msg = err.response?.data?.msg || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md w-full max-w-sm border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
            className="px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className="px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <a
          href={`${BACKEND_URL}/api/users/auth/google`}
          className="flex items-center justify-center gap-2 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
          Continue with Google
        </a>
      </div>
    </div>
  );
};

export default Register;