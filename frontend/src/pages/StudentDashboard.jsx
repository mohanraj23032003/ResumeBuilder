import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { downloadResumePdf } from "../api/students";
import ProfileForm from "./resume/ProfileForm";
import EducationForm from "./resume/EducationForm";
import ExperienceForm from "./resume/ExperienceForm";
import ProjectForm from "./resume/ProjectForm";
import CertificationForm from "./resume/CertificationForm";
import SkillsForm from "./resume/SkillsForm";
import "../styles/student.css";

const SECTIONS = {
  Profile: ProfileForm,
  Education: EducationForm,
  Experience: ExperienceForm,
  Projects: ProjectForm,
  Certifications: CertificationForm,
  Skills: SkillsForm,
};

export default function StudentDashboard() {
  const [tab, setTab] = useState("Profile");
  const [downloading, setDownloading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ActiveSection = SECTIONS[tab];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await downloadResumePdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="student-sidebar__brand">Resume Builder</div>
        <nav className="student-sidebar__nav">
          {Object.keys(SECTIONS).map((s) => (
            <button
              key={s}
              className="student-sidebar__link"
              aria-current={tab === s ? "page" : undefined}
              onClick={() => setTab(s)}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="student-sidebar__footer">
          <button className="student-sidebar__logout" onClick={handleDownload} disabled={downloading} style={{ marginBottom: 8, width: "100%" }}>
            {downloading ? "Generating..." : "Download resume"}
          </button>
          <div className="student-sidebar__user">{user?.username}</div>
          <button className="student-sidebar__logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="student-main">
        <ActiveSection />
      </main>
    </div>
  );
}