import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Blocks, EyeOff, Eye, CircleCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (!agreed) {
      return setError("Please agree to the Terms of Service");
    }

    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left indigo">
        <div className="auth-brand">
          <Blocks size={28} color="#fff" />
          <span>ToyShare</span>
        </div>
        <h2>Start Your<br />Sharing Journey</h2>
        <p>Create your free account and join thousands of families sharing toys sustainably.</p>
        <div className="auth-checks">
          <div><CircleCheck size={20} /> Free forever for personal use</div>
          <div><CircleCheck size={20} /> Share & borrow unlimited toys</div>
          <div><CircleCheck size={20} /> Trusted community & ratings</div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Fill in your details to get started</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-password">
              <input name="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <button type="submit" className="btn-primary full indigo" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
