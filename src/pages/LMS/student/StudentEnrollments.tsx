import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../api/Api";

interface Enrollment {
  id: number | string;
  status: string;
  enrolledAt: string;
  course: {
    id: number;
    title: string;
    description: string;
    fee: number;
    category: string;
    capacity: number;
  };
}

export default function StudentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const studentId = localStorage.getItem("userId");

        if (!studentId) {
          throw new Error("Student ID not found. Please login again.");
        }

        const res = await fetch(
          `${API_BASE_URL}/api/enrollments/student/${studentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }

        const data = await res.json();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load enrollments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleOpenCourse = (enrollment: Enrollment) => {
    if (enrollment.status?.toLowerCase() === "pending") return;
      navigate(`/student/enrollments/myUnits/${enrollment.course.id}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
  };

  return (
    <>
      <PageMeta
        title="My Enrollments | Student"
        description="View your enrolled courses"
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Enrollments
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Click active courses to view details
        </p>
      </div>

      {/* STATES */}
      {isLoading && (
        <div className="text-center text-gray-500 py-10">
          Loading enrollments...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-10">
          {error}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => {
          const isPending =
            enrollment.status?.toLowerCase() === "pending";

          return (
            <div
              key={enrollment.id}
              onClick={() => handleOpenCourse(enrollment)}
              className={`relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition
              ${
                isPending
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }`}
            >
              {/* LOCK OVERLAY */}
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/50 rounded-2xl">
                  <div className="text-center">
                    <span className="text-3xl">🔒</span>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                      Pending Approval
                    </p>
                  </div>
                </div>
              )}

              {/* HEADER */}
              
              <img
                src={
                  "https://info.ehl.edu/hubfs/Blog-EHL-Insights/Blog-Header-EHL-Insights/e_learning_course.jpg"
                }
                className="h-44 w-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="flex justify-between items-start">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusStyle(
                    enrollment.status
                  )}`}
                >
                  {enrollment.status}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="mt-3 text-lg font-semibold text-gray-800 dark:text-white">
                {enrollment.course?.title}
              </h2>

              <p className="text-xs text-gray-400">
                {enrollment.course?.category}
              </p>

              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {enrollment.course?.description}
              </p>

              {/* DATE */}
              <p className="mt-1 text-xs text-gray-400">
                Enrolled: {enrollment.enrolledAt}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}