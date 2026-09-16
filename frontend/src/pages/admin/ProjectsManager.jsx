import { useEffect, useState } from "react";
import { listAdminProjects, addAdminProject, deleteAdminProject } from "../../api/admin";

const EMPTY = { title: "", description: "", tech_stack: "" };

export default function ProjectsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);

  const load = () => listAdminProjects().then((res) => setItems(res.data));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addAdminProject(form);
    setForm(EMPTY);
    load();
  };

  return (
    <div>
      <h2 className="admin-page-title">Project catalog</h2>

      <div className="admin-section-card">
        <h3>Add a project</h3>
        <form className="admin-inline-form" onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Project title" />
          <input name="tech_stack" value={form.tech_stack} onChange={handleChange} placeholder="Tech stack" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Short description" />
          <button className="admin-btn" type="submit">Add</button>
        </form>
      </div>

      <div className="admin-section-card">
        {items.length === 0 && <p style={{ color: "var(--slate)" }}>No catalog projects yet.</p>}
        {items.map((p) => (
          <div className="admin-list-row" key={p.id}>
            <span><strong>{p.title}</strong> — {p.tech_stack}</span>
            <button className="admin-btn-danger" onClick={() => deleteAdminProject(p.id).then(load)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}