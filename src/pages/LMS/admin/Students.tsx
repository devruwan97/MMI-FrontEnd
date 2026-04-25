import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Student {
  id: number;
  userId: number;
  dateOfBirth?: string;
  parentName?: string;
  address?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("No token found. Please login.");
        }

        const res = await fetch("http://localhost:8080/api/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          throw new Error("Unauthorized (401): Please login again");
        }

        if (res.status === 403) {
          throw new Error("Forbidden (403): Admin access required");
        }

        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }

        const data = await res.json();

        const list = Array.isArray(data) ? data : data.students || [];

        setStudents(list);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    String(s.userId).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Students | Admin" description="View all students" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Students
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Detailed list of all registered students
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by user ID..."
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
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Student ID
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  User ID
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Date of Birth
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Parent Name
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                  Address
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">
                      {s.id}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {s.userId}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {s.dateOfBirth || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {s.parentName || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {s.address || "—"}
                    </td>
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
