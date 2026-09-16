import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthIntroPanel from "../components/AuthIntroPanel";
import "../styles/auth.css";

export default function Login() {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const me = await login(username, password);
      if (me.role !== role) {
        setError(
          me.role === "admin"
            ? "This account is an admin account. Switch to the Admin tab to continue."
            : "This account is a student account. Switch to the Student tab to continue."
        );
        return;
      }
      navigate(me.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Incorrect username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <AuthIntroPanel
        headline="Turn what you've learned into a resume that shows it."
        sub="Rate yourself on every topic your courses cover, and we'll lay it out clearly for anyone reading your resume."
      />

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2 className="auth-heading">Sign in</h2>
          <p className="auth-subheading">Choose your account type to continue.</p>

          <div className="auth-tabs" role="tablist" aria-label="Account type">
            <button
              type="button"
              role="tab"
              aria-selected={role === "student"}
              className="auth-tab"
              onClick={() => { setRole("student"); setError(""); }}
            >
              Student
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "admin"}
              className="auth-tab"
              onClick={() => { setRole("admin"); setError(""); }}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : `Sign in as ${role === "admin" ? "admin" : "student"}`}
            </button>
          </form>

          {role === "student" && (
            <p className="auth-hint">
              New here? <Link to="/register">Create a student account</Link>
            </p>
          )}
          {role === "admin" && (
            <p className="auth-hint">
              Admin accounts are provisioned separately and are not self-registered.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
