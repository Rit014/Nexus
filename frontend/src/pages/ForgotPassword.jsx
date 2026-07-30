import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../lib/api";
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/users/forgot-password", { email });
      toast.success(res.data.msg || "Reset link sent to your email.");
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err.message);
      toast.error(err.response?.data?.msg || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md w-full max-w-sm border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;