import { useEffect, useState } from "react";
import { listAdminProjects } from "../../api/admin";
import { listMyProjectSelections, selectProject, unselectProject } from "../../api/students";

export default function ProjectForm() {
  const [catalog, setCatalog] = useState([]);
  const [selections, setSelections] = useState([]);

  const load = async () => {
    const [catalogRes, selectionsRes] = await Promise.all([
      listAdminProjects(),
      listMyProjectSelections(),
    ]);
    setCatalog(catalogRes.data);
    setSelections(selectionsRes.data);
  };

  useEffect(() => { load(); }, []);

  const selectionFor = (projectId) => selections.find((s) => s.project === projectId);

  const handleToggle = async (projectId) => {
    const existing = selectionFor(projectId);
    if (existing) {
      await unselectProject(existing.id);
    } else {
      await selectProject(projectId);
    }
    load();
  };

  return (
    <div className="card">
      <h3>Projects</h3>
      <p>Select the projects you've worked on. These will appear on your resume.</p>
      {catalog.length === 0 && <p style={{ color: "#445069" }}>No projects have been added by your admin yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {catalog.map((p) => {
          const checked = Boolean(selectionFor(p.id));
          return (
            <li key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #dcd5c7" }}>
              <input
                type="checkbox"
                id={`project-${p.id}`}
                name={`project-${p.id}`}
                checked={checked}
                onChange={() => handleToggle(p.id)}
                style={{ width: "auto", marginTop: 3 }}
              />
              <label htmlFor={`project-${p.id}`} style={{ marginBottom: 0, cursor: "pointer" }}>
                <strong>{p.title}</strong>
                {p.tech_stack && <div style={{ fontSize: 13, color: "#445069" }}>{p.tech_stack}</div>}
                {p.description && <div style={{ fontSize: 13 }}>{p.description}</div>}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}