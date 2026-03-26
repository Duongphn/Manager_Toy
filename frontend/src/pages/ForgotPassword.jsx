import { useState } from "react";
import { Link } from "react-router-dom";
import { Blocks, KeyRound, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-logo">
        <Blocks size={28} color="#FF6B6B" />
        <span>ToyShare</span>
      </div>

      <div className="forgot-card">
        {sent ? (
          <div className="forgot-success">
            <div className="forgot-icon-circle green">
              <Mail size={28} color="#22C55E" />
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn-primary full">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="forgot-icon-circle">
              <KeyRound size={28} color="#FF6B6B" />
            </div>
            <h2>Forgot Password?</h2>
            <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-icon">
                  <Mail size={18} color="#9CA3AF" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Sign In</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
