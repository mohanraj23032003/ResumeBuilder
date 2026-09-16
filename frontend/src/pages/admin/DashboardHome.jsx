import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-card__value">{stats.total_students}</p>
          <p className="admin-stat-card__label">Total students</p>
        </div>
        <div className="admin-stat-card admin-stat-card--accent">
          <p className="admin-stat-card__value">{stats.active_students}</p>
          <p className="admin-stat-card__label">Active in last 15 min</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__value">{stats.total_courses}</p>
          <p className="admin-stat-card__label">Courses</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__value">{stats.total_topics}</p>
          <p className="admin-stat-card__label">Topics</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-card__value">{stats.total_catalog_projects}</p>
          <p className="admin-stat-card__label">Catalog projects</p>
        </div>
      </div>
    </div>
  );
}