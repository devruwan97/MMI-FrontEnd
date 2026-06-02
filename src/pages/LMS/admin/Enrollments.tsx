import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../api/Api";

interface Enrollment {
  id: number;
  student_name: string;
  course_title: string;
  status: string;
  enrolled_at: string;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/enrollments`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        const mapped = list.map((item: any) => ({
          id: item.id,
          student_name: item.student?.user?.name || "N/A",
          course_title: item.course?.title || "N/A",
          status: (item.status || "pending").toLowerCase(),
          enrolled_at: item.enrolledAt
            ? new Date(item.enrolledAt).toLocaleDateString()
            : "N/A",
        }));

        setEnrollments(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE_URL}/api/enrollments/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!res.ok) throw new Error();

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: newStatus } : e
        )
      );
    } catch {
      alert("Status update failed");
    }
  };

  const uniqueCourses = ["all", ...new Set(enrollments.map(e => e.course_title))];

  const filtered = enrollments.filter((e) => {
    const matchSearch =
      e.student_name.toLowerCase().includes(search.toLowerCase()) ||
      e.course_title.toLowerCase().includes(search.toLowerCase());

    const matchCourse =
      courseFilter === "all" || e.course_title === courseFilter;

    const matchStatus =
      statusFilter === "all" || e.status === statusFilter;

    return matchSearch && matchCourse && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <PageMeta title="All Enrollments | Admin" description="Manage enrollments" />

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            All Enrollments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage student course registrations
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col lg:flex-row gap-3">

          <input
            type="text"
            placeholder="Search student or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border px-4 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-xl border px-4 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
          >
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Courses" : c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border px-4 py-2 text-sm dark:bg-gray-900 dark:border-gray-700"
          >
            <option value="all">All Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

        </div>

        {/* STATES */}
        {isLoading && (
          <div className="text-center py-10 text-gray-500">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !error && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-lg">

            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-5 py-4 text-left">Student</th>
                  <th className="px-5 py-4 text-left">Course</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {e.student_name}
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {e.course_title}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        className={`text-xs px-3 py-1 rounded-full border outline-none ${getStatusBadge(
                          e.status
                        )}`}
                      >
                        <option value="enrolled">Enrolled</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {e.enrolled_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </>
  );
}