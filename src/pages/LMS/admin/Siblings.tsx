import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface SiblingRequest {
  id: number;
  requesterStudentId: number;
  targetStudentId: number;
  status: string;
}

export default function Siblings() {
  const [requests, setRequests] = useState<SiblingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/siblings/allRequests", {
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
        const list = Array.isArray(data) ? data : [];
        setRequests(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching siblings:", err);
        setError(err.message || "Failed to load sibling records.");
        setIsLoading(false);
      });
  }, []);

  const handleApprove = async (requestId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8080/api/siblings/approve/${requestId}`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "APPROVED" } : r
        )
      );

      alert("Request approved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (requestId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8080/api/siblings/reject/${requestId}`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "REJECTED" } : r
        )
      );

      alert("Request rejected successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

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
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Request ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Requester Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Target Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {error ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-red-500 font-medium">Error: {error}</td></tr>
              ) : isLoading ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-500">Loading records...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-gray-500">No sibling Requests found</td></tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {request.id}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {"MMIS"+request.requesterStudentId}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {"MMIS"+request.targetStudentId}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${request.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : request.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {request.status === "PENDING" ? (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const value = e.target.value;

                            if (value === "approve") {
                              handleApprove(request.id);
                            }

                            if (value === "reject") {
                              handleReject(request.id);
                            }

                            e.target.selectedIndex = 0;
                          }}
                          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                        >
                          <option value="">Actions</option>
                          <option value="approve">Approve</option>
                          <option value="reject">Reject</option>
                        </select>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Completed
                        </span>
                      )}
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
