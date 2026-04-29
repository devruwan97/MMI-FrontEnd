import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Sibling {
  id: number;
  name?: string;
}

interface SiblingGroup {
  id: number;
  groupName: string;
  siblings?: Sibling[];
}

export default function Siblings() {
  const [groups, setGroups] = useState<SiblingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/siblings/groups", {
      headers: {
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized (401): Please login again");
        }
        if (res.status === 403) {
          throw new Error("Forbidden (403): Admin access required for Sibling Management");
        }

        if (!res.ok) {
          const errorBody = await res.text().catch(() => "");
          throw new Error(`Server error: ${res.status} ${errorBody}`);
        }
        
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("JSON Parse Error. Raw response:", text);
          throw new Error("The server is sending circular data (recursion). Please check the backend console logs.");
        }
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.groups || [];
        setGroups(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching siblings:", err);
        setError(err.message || "Failed to load sibling records.");
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <PageMeta title="Siblings | Admin" description="Manage student sibling relationships" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Siblings Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed view of all linked student sibling groups</p>
        </div>
        
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Group ID</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Group Name</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Member Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-500">Loading records...</td></tr>
              ) : groups.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-500">No sibling groups found</td></tr>
              ) : (
                groups.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4 text-gray-400 text-xs">#{g.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">{g.groupName}</td>
                    <td className="px-5 py-4 text-gray-500">{g.siblings?.length || 0} Students</td>
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
