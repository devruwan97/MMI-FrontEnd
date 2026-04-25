import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/courses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized - please login again");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        alert("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized - cannot delete");
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      alert("Course deleted successfully");
      navigate("/courses");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting course");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Course not found.
        </p>
        <Link
          to="/courses"
          className="mt-4 inline-block text-brand-500 hover:underline"
        >
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${course.title} | LMS`}
        description={course.description}
      />

      <Link
        to="/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm text-brand-500 hover:underline"
      >
        ← Back to Courses
      </Link>

      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-6">
        <img
          src={
            course.image ||
            "https://via.placeholder.com/800x300?text=Course"
          }
          alt={course.title}
          className="h-56 w-full object-cover"
        />

        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full">
                {course.category}
              </span>

              <h1 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {course.title}
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {course.description}
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center min-w-[140px]">
              <p className="text-3xl font-bold text-brand-600">
                ${course.fee}
              </p>
              <p className="text-xs text-gray-400">per term</p>

              <button className="mt-3 w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                Enrol Now
              </button>

              <p className="mt-2 text-xs text-gray-400">
                Capacity: {course.capacity}
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() =>
                    navigate(`/courses/edit/${course.id}`)
                  }
                  className="w-full rounded-lg bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                >
                  Edit Course
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full rounded-lg bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Course Details
            </h2>

            <p className="text-gray-500">
              No unit data available yet.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          {course.createdBy && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Course Creator
              </h2>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
                  {course.createdBy.name?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold">
                    {course.createdBy.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {course.createdBy.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Class Schedule
            </h2>

            <p className="text-sm text-gray-400">
              No schedule available yet.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
