import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

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

  // ---------------- FETCH ALL ENROLLMENTS ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/enrollments", {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];

        // ✅ FIXED MAPPING FROM YOUR BACKEND JSON
        const mapped = list.map((item: any) => ({
          id: item.id,
          student_name: item.student?.user?.name || "N/A",
          course_title: item.course?.title || "N/A",
          status: (item.status || "pending").toLowerCase(), // 🔥 FIXED
          enrolled_at: item.enrolledAt
            ? new Date(item.enrolledAt).toLocaleDateString()
            : "N/A",
        }));

        setEnrollments(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ---------------- UPDATE STATUS API ----------------
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/enrollments/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const updated = await res.json();

      // 🔥 normalize backend response
      const updatedStatus = (updated.status || newStatus).toLowerCase();

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: updatedStatus } : e
        )
      );
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  // ---------------- SEARCH FILTER ----------------
  const filtered = enrollments.filter(
    (e) =>
      e.student_name.toLowerCase().includes(search.toLowerCase()) ||
      e.course_title.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- STATUS COLORS ----------------
  const getStatusStyle = (status: string) => {
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
      <PageMeta
        title="All Enrollments | Admin"
        description="Manage enrollments"
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          All Enrollments
        </h1>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search student or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md rounded-xl border px-4 py-2 text-sm dark:bg-gray-900"
      />

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
      <div className="rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">Course</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t dark:border-gray-800">
                {/* STUDENT */}
                <td className="px-5 py-4 font-medium">
                  {e.student_name}
                </td>

                {/* COURSE */}
                <td className="px-5 py-4">
                  {e.course_title}
                </td>

                {/* STATUS DROPDOWN */}
                <td className="px-5 py-4">
                  <select
                    value={e.status}
                    onChange={(ev) =>
                      updateStatus(e.id, ev.target.value)
                    }
                    className={`text-xs px-2 py-1 rounded-md border ${getStatusStyle(
                      e.status
                    )}`}
                  >
                    <option value="enrolled">ENROLLED</option>
                    <option value="pending">PENDING</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </td>

                {/* DATE */}
                <td className="px-5 py-4 text-xs text-gray-500">
                  {e.enrolled_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}