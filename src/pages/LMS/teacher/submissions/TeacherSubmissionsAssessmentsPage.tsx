import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";

interface Assessment {
  id: number;
  title: string;
  type?: string;
}

export default function TeacherSubmissionsAssessmentsPage() {
  const { courseId, unitId } = useParams();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:8080/api/units/${unitId}/assessments`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const data = await res.json();

        const formatted = (data.assessments || []).map((a: any) => ({
          id: a.id,
          title: a.assessmentName,
          type: a.assessmentCode?.includes("Q")
            ? "Quiz"
            : "Assignment",
        }));

        setAssessments(formatted);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchAssessments();
    }
  }, [courseId, unitId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading assessments...
      </div>
    );
  }

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
        title="Assessments | LMS"
        description="Teacher assessments page"
      />

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <p className="text-blue-100 text-sm">
          Select an assessment to view submissions
        </p>

        <h1 className="text-2xl font-bold mt-0.5">
          Assessments
        </h1>

        <p className="text-sm text-blue-100 mt-1">
          Unit ID: {unitId}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* ================= FINAL GRADES TILE (NEW) ================= */}
        <Link
          to={`/teacher/submissions/${courseId}/units/${unitId}/final-grades`}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
        >
          <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg font-bold">
            Final Grades
          </div>

          <div className="p-4">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Unit Final Grades
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View overall student performance across all assessments
            </p>
          </div>
        </Link>

        {assessments.map((a) => (
          <Link
            key={a.id}
            to={`/teacher/submissions/${courseId}/units/${unitId}/assessments/${a.id}/submissions`}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
          >
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
              {a.type || "Assessment"}
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                {a.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Click to view student submissions
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}