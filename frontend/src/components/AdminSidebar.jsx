import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "courses", label: "Courses" },
  { key: "projects", label: "Projects" },
  { key: "students", label: "Students" },
];

export default function AdminSidebar({ active, onSelect }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">Resume Builder</div>
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className="admin-sidebar__link"
            aria-current={active === item.key ? "page" : undefined}
            onClick={() => onSelect(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">{user?.username}</div>
        <button className="admin-sidebar__logout" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}