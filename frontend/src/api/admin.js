import api from "./axios";

export const getDashboardStats = () => api.get("admin/dashboard-stats/");
export const listStudentsAdmin = () => api.get("students-list/");

export const listAdminProjects = () => api.get("admin-projects/");
export const addAdminProject = (data) => api.post("admin-projects/", data);
export const deleteAdminProject = (id) => api.delete(`admin-projects/${id}/`);