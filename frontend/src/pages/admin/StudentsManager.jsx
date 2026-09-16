import { useEffect, useState } from "react";
import { listStudentsAdmin } from "../../api/admin";

export default function StudentsManager() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    listStudentsAdmin().then((res) => setStudents(res.data));
  }, []);

  return (
    <div>
      <h2 className="admin-page-title">Students</h2>
      <div className="admin-section-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.username}</td>
                <td>{s.email}</td>
                <td>{new Date(s.date_joined).toLocaleDateString()}</td>
                <td>
                  <span className={`admin-badge ${s.is_active_now ? "admin-badge--active" : "admin-badge--inactive"}`}>
                    {s.is_active_now ? "Active now" : "Offline"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}