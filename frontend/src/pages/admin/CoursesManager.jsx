import { useEffect, useState } from "react";
import { listCourses, addCourse, deleteCourse, addTopic, deleteTopic } from "../../api/skills";

export default function CoursesManager() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [topicForms, setTopicForms] = useState({});

  const load = () => listCourses().then((res) => setCourses(res.data));
  useEffect(() => { load(); }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    await addCourse({ name: courseName });
    setCourseName("");
    load();
  };

  const handleAddTopic = async (courseId) => {
    const name = topicForms[courseId];
    if (!name?.trim()) return;
    await addTopic({ course: courseId, name });
    setTopicForms({ ...topicForms, [courseId]: "" });
    load();
  };

  return (
    <div>
      <h2 className="admin-page-title">Courses</h2>

      <div className="admin-section-card">
        <h3>Add a course</h3>
        <form className="admin-inline-form" onSubmit={handleAddCourse}>
          <input
            id="course-name"
            name="course-name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Python"
          />
          <button className="admin-btn" type="submit">Add course</button>
        </form>
      </div>

      {courses.map((course) => (
        <div className="admin-section-card" key={course.id}>
          <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {course.name}
            <button className="admin-btn-danger" onClick={() => deleteCourse(course.id).then(load)}>Delete course</button>
          </h3>

          {course.topics.map((topic) => (
            <div className="admin-list-row" key={topic.id}>
              <span>{topic.name}</span>
              <button className="admin-btn-danger" onClick={() => deleteTopic(topic.id).then(load)}>Delete</button>
            </div>
          ))}

          <form
            className="admin-inline-form"
            style={{ marginTop: 14 }}
            onSubmit={(e) => { e.preventDefault(); handleAddTopic(course.id); }}
          >
            <input
              id={`topic-name-${course.id}`}
              name={`topic-name-${course.id}`}
              placeholder="New topic name"
              value={topicForms[course.id] || ""}
              onChange={(e) => setTopicForms({ ...topicForms, [course.id]: e.target.value })}
            />
            <button className="admin-btn" type="submit">Add topic</button>
          </form>
        </div>
      ))}
    </div>
  );
}