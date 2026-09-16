import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import DashboardHome from "./admin/DashboardHome";
import CoursesManager from "./admin/CoursesManager";
import ProjectsManager from "./admin/ProjectsManager";
import StudentsManager from "./admin/StudentsManager";
import "../styles/admin.css";

const PAGES = {
  dashboard: DashboardHome,
  courses: CoursesManager,
  projects: ProjectsManager,
  students: StudentsManager,
};

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const ActivePage = PAGES[active];

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} onSelect={setActive} />
      <main className="admin-main">
        <ActivePage />
      </main>
    </div>
  );
}