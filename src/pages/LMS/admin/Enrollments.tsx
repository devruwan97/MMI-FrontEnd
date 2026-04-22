import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Enrollment {
  id: string | number;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found in localStorage.");
    }

    const url = "http://localhost:8080/api/enrollments";
    console.log(`Attempting to fetch enrollments from: ${url} (Token present: ${!!token})`);

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("Access Forbidden (403): Your account does not have permission to view enrollment records.");
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Enrollment data successfully received:", data);
        const list = Array.isArray(data) ? data : data.enrollments || [];
        setEnrollments(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredEnrollments = enrollments.filter((e) =>
    e.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.course_title?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <>
      <PageMeta title="All Enrollments | Admin" description="Manage all student enrollments" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Enrollments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track and manage student participation across all courses
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Course</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">Loading enrollment records...</td></tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No enrollment records found</td></tr>
              ) : (
                filteredEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4 text-gray-400 text-xs">#{e.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">{e.student_name}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{e.course_title}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusStyle(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{e.enrolled_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}