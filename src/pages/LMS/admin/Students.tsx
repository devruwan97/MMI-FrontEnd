import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Student {
  id: string | number;
  name: string;
  email: string;
  date_of_birth?: string;
  parent_name?: string;
  address?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = "http://localhost:8080/api/students";
    console.log(`Fetching students from: ${url}`);

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("Access Forbidden (403): Administrative role required to view student records.");
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        // Handle potential wrapped response data
        const list = Array.isArray(data) ? data : data.students || [];
        setStudents(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Students | Admin" description="View all students" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Detailed list of all registered students and their information
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students by name or email..."
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
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date of Birth</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Parent/Guardian</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">Loading student records...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No student records found</td></tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold">
                          {s.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{s.email}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{s.date_of_birth || "—"}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{s.parent_name || "—"}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{s.address || "—"}</td>
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