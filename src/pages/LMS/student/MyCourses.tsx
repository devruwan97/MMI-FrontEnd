import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

interface Course {
  id: string | number;
  title: string;
  category: string;
  image?: string;
  description?: string;
  status: string; // e.g., 'active', 'completed'
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Assuming the backend has a specific endpoint for the logged-in student's courses
    const url = "http://localhost:8080/api/student/my-courses";

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.courses || [];
        setCourses(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my courses:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <PageMeta title="My Courses | Student" description="View your enrolled courses" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Access your learning materials and track your progress
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-medium">Error: {error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center">
          <div className="mb-4 text-4xl">📚</div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't enrolled in any courses yet.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all"
            >
              <img
                src={course.image || "https://via.placeholder.com/400x200?text=Course"}
                alt={course.title}
                className="h-40 w-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {course.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-brand-500">
                  Go to Course →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}