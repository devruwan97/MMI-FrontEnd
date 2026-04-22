import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Teacher {
  id: string | number;
  name: string;
}

interface Course {
  id: string | number;
  title: string;
}

export default function AssignCoursesPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

    // Fetch Teachers and Courses in parallel
    Promise.all([
      fetch("http://localhost:8080/api/teachers", { headers }).then((res) => res.json()),
      fetch("http://localhost:8080/api/courses", { headers }).then((res) => res.json()),
    ])
      .then(([teacherData, courseData]) => {
        setTeachers(Array.isArray(teacherData) ? teacherData : teacherData.teachers || []);
        setCourses(Array.isArray(courseData) ? courseData : courseData.courses || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading assignment data:", err);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedCourse) return;

    setIsSubmitting(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    try {
      // Assuming a backend endpoint structure for assignments
      const res = await fetch(`http://localhost:8080/api/teachers/${selectedTeacher}/courses/${selectedCourse}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Failed to assign course to teacher");

      setMessage({ type: "success", text: "Course assigned successfully!" });
      setSelectedCourse("");
      setSelectedTeacher("");
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading list data...</div>;

  return (
    <>
      <PageMeta title="Assign Courses | Admin" description="Assign teachers to specific courses" />

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Assign Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Connect a teacher with a course to manage instruction
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-red-50 text-red-700 dark:bg-red-900/20"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Teacher
              </label>
              <select
                required
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Choose a teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Course
              </label>
              <select
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Choose a course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !selectedTeacher || !selectedCourse}
                className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Assigning...
                  </span>
                ) : "Assign Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}