import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";
import AuthIntroPanel from "../components/AuthIntroPanel";
import "../styles/auth.css";

const EMPTY = {
  first_name: "", last_name: "", username: "", email: "",
  password: "", password2: "",
};

export default function Register() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await registerRequest(form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        // DRF returns { field: ["message"] } — flatten to { field: "message" }
        const flat = {};
        Object.entries(data).forEach(([key, val]) => {
          flat[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(flat);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <AuthIntroPanel
        headline="Your first resume starts with one honest self-rating."
        sub="Create your student account, then work through your courses and rate yourself topic by topic."
        bars={[40, 55, 30, 60, 20]}
      />

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2 className="auth-heading">Create your student account</h2>
          <p className="auth-subheading">Takes less than a minute.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="auth-field" style={{ flex: 1 }}>
                <label htmlFor="first_name">First name</label>
                <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="auth-field" style={{ flex: 1 }}>
                <label htmlFor="last_name">Last name</label>
                <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={form.username} onChange={handleChange} autoComplete="username" required />
              {errors.username && <p className="auth-error">{errors.username}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="password2">Confirm password</label>
              <input id="password2" name="password2" type="password" value={form.password2} onChange={handleChange} autoComplete="new-password" required />
              {errors.password2 && <p className="auth-error">{errors.password2}</p>}
            </div>

            {errors.general && <p className="auth-error">{errors.general}</p>}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-hint">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
