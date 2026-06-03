import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../../api/Api";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
}

export default function TeacherSubmissionsCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_BASE_URL}/api/teachers/${teacherId}/schedule/courses`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) fetchCourses();
  }, [teacherId, token]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading submissions...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Teacher Submissions | LMS"
        description="View course submissions"
      />

      {/* ================= HEADER ================= */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <p className="text-indigo-100 text-sm">Manage student work</p>

        <h1 className="text-2xl font-bold mt-0.5">
          Submissions
        </h1>

        <p className="text-sm text-indigo-100 mt-1">
          Select a course to view units and assessments
        </p>

        <div className="mt-3 flex gap-3 text-sm flex-wrap">
          <span className="bg-white/20 rounded-lg px-3 py-1">
            {courses.length} Courses
          </span>

          <span className="bg-white/20 rounded-lg px-3 py-1">
            Teacher Portal
          </span>
        </div>
      </div>

      {/* ================= GRID ================= */}
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No courses assigned
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/teacher/submissions/${course.id}/units`}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
            >
              {/* IMAGE */}
              <img
                src="https://info.ehl.edu/hubfs/Blog-EHL-Insights/Blog-Header-EHL-Insights/e_learning_course.jpg"
                alt={course.title}
                className="h-36 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                    Submissions
                  </span>
                </div>

                <h3 className="mt-3 font-semibold text-gray-800 dark:text-white">
                  {course.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-4 text-sm font-semibold text-indigo-500">
                  View Units →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}