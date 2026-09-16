import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/students";

const EMPTY = {
  full_name: "", phone: "", address: "", linkedin_url: "",
  github_url: "", portfolio_url: "", summary: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then((res) => setForm({ ...EMPTY, ...res.data }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div className="card">
      <h3>Profile</h3>
      <form onSubmit={handleSubmit}>
        <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full name" autoComplete="name" required />
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" autoComplete="tel" />
        <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Address" autoComplete="street-address" />
        <input id="linkedin_url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} placeholder="LinkedIn URL" autoComplete="url" />
        <input id="github_url" name="github_url" value={form.github_url} onChange={handleChange} placeholder="GitHub URL" autoComplete="url" />
        <input id="portfolio_url" name="portfolio_url" value={form.portfolio_url} onChange={handleChange} placeholder="Portfolio URL" autoComplete="url" />
        <textarea id="summary" name="summary" value={form.summary} onChange={handleChange} placeholder="Professional summary" rows={4} />
        {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}
        <button type="submit">Save profile</button>
        {saved && <span> Saved!</span>}
      </form>
    </div>
  );
}