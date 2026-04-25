import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

const categories = [
  "All",
  "Mathematics",
  "English",
  "Science",
  "Technology",
  "Humanities",
  "Arts",
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/courses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized - please login again");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        alert("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filtered = courses.filter((c) => {
    const matchCat = selected === "All" || c.category === selected;

    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <>
      <PageMeta
        title="Courses | LMS"
        description="Browse all available courses"
      />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Course Catalogue
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Find the right course for your learning journey
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-brand-400"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selected === cat
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">
          Loading courses...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No courses found. Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={
                  course.image ||
                  "https://via.placeholder.com/400x200?text=Course"
                }
                alt={course.title}
                className="h-44 w-full object-cover group-hover:opacity-90 transition-opacity"
              />

              <div className="p-5">
                <span className="text-xs font-medium text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
                  {course.category}
                </span>

                <h3 className="mt-2 font-semibold text-gray-800 dark:text-white">
                  {course.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                    ${course.fee}
                    <span className="text-xs text-gray-400 font-normal">
                      /term
                    </span>
                  </span>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Capacity: {course.capacity}
                  </span>
                </div>

                {course.createdBy && (
                  <div className="mt-2 text-xs text-gray-400">
                    By: {course.createdBy.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
