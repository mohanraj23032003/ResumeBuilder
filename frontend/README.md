# Resume Builder — Frontend (React + Vite)

## Setup

1. Make sure your Django backend is running on `http://localhost:8000`
   and has CORS enabled for `http://localhost:5173` (see `CORS_ALLOWED_ORIGINS`
   in your Django `settings.py`).

2. Install dependencies:
   ```
   npm install
   ```

3. Run the dev server:
   ```
   npm run dev
   ```
   App runs at `http://localhost:5173`

## Folder structure

```
src/
  api/            axios instance + endpoint wrappers per Django app
    axios.js      base instance, JWT attach + auto-refresh
    auth.js       login / me
    skills.js     courses, topics, student skill ratings
    students.js   profile, education, experience, projects, certifications, resume pdf
  context/
    AuthContext.jsx   holds logged-in user + role, persists session via JWT
  components/
    ProtectedRoute.jsx   redirects based on auth state + role
    Navbar.jsx
  pages/
    Login.jsx
    AdminDashboard.jsx     course/topic CRUD (admin only)
    StudentDashboard.jsx   tabbed resume sections (student only)
    resume/
      ProfileForm.jsx
      EducationForm.jsx
      ExperienceForm.jsx
      ProjectForm.jsx
      CertificationForm.jsx
      SkillsForm.jsx
  App.jsx         routes
  main.jsx        entry point
```

## How auth flow works

1. Login page posts username/password to `/api/token/`, receives `access` + `refresh` JWTs.
2. Tokens are stored in `localStorage`.
3. Every API call attaches `Authorization: Bearer <access>` via an axios interceptor.
4. If a request gets a 401 (expired token), the interceptor automatically calls
   `/api/token/refresh/` once and retries the original request.
5. `AuthContext` calls `/api/me/` on app load to restore the session and get the user's `role`,
   which drives whether they land on `/admin` or `/dashboard`.

## Notes

- Update `BASE_URL` in `src/api/axios.js` if your backend runs on a different host/port.
- Every student-facing endpoint is scoped server-side to `request.user`, so the frontend
  never needs to (and never should) send a student ID manually.
