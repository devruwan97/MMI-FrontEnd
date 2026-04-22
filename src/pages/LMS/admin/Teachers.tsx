import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Teacher {
  id: string | number;
  name: string;
  email: string;
  qualifications?: string;
  bio?: string;
  availability?: {
    days: string[];
    time_slots: string[];
  };
  courses?: number[]; // Assuming course IDs
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = "http://localhost:8080/api/teachers"; // Assuming this is your teachers API endpoint
    console.log(`Fetching teachers from: ${url}`);

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("Access Forbidden (403): Administrative role required to view teacher records.");
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        // Handle potential wrapped response data
        const list = Array.isArray(data) ? data : data.teachers || [];
        setTeachers(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredTeachers = teachers.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.qualifications?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Teachers | Admin" description="View all teachers" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Teachers</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Detailed list of all registered teachers and their information
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search teachers by name, email, or qualifications..."
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
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teacher</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Qualifications</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bio</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available Days</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Courses Taught</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">Loading teacher records...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No teacher records found</td></tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center font-bold">
                          {t.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.email}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.qualifications || "—"}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{t.bio || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {t.availability?.days?.map((d) => (
                          <span key={d} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{d.slice(0, 3)}</span>
                        )) || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{t.courses?.length ?? 0}</td>
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