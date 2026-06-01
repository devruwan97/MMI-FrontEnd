import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageMeta from "../../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../../api/Api";

interface Unit {
  id: number;
  unitCode: string;
  unitName: string;
  description?: string;
}

export default function TeacherSubmissionsUnitsPage() {
  const { courseId } = useParams();

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE_URL}/api/courses/${courseId}/units`,
          {
            headers: {
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

        // ✅ FIX: handle multiple backend response formats
        const extractedUnits =
          data?.units ||
          data?.data?.units ||
          (Array.isArray(data) ? data : []);

        setUnits(extractedUnits);
      } catch (err: any) {
        setError(err.message || "Failed to load units");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchUnits();
  }, [courseId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading units...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Submission Units | LMS"
        description="Teacher submission units"
      />

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <p className="text-indigo-100 text-sm">
          Select a unit to view assessments
        </p>

        <h1 className="text-2xl font-bold mt-0.5">
          Course Units
        </h1>

        <p className="text-sm text-indigo-100 mt-1">
          Submissions workflow
        </p>
      </div>

      {/* GRID */}
      {units.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No units found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {units.map((u) => (
            <Link
              key={u.id}
              to={`/teacher/submissions/${courseId}/units/${u.id}/assessments`}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
            >
              {/* HEADER BLOCK */}
              <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {u.unitCode}
              </div>

              {/* BODY */}
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {u.unitName}
                </h2>

                {u.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {u.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                    Unit
                  </span>

                  <span className="text-sm font-semibold text-indigo-500">
                    Open →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}