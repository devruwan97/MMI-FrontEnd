import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";

interface Material {
  id: number;
  title: string;
  url: string;
}

interface Unit {
  id: number;
  unitCode: string;
  unitName: string;
  description: string;
  materials: Material[];
}

interface Grade {
  studentId: number;
  marks: number;
  grade: string;
}

interface Assessment {
  id: number;
  assessmentCode: string;
  assessmentName: string;
  description: string;
  maxMarks: number;
  dueDate: string;
  submitUrl?: string;
  grades?: Grade[];
}

interface AssessmentResponse {
  unitId: number;
  assessments: Assessment[];
}

export default function UnitDetailsPage() {
  const location = useLocation();
  const unit: Unit | undefined = location.state?.unit;

  const [openMaterials, setOpenMaterials] = useState(true);
  const [openAssessments, setOpenAssessments] = useState(false);

  const [data, setData] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // SAFE DATE CHECK (FIXED)
  const isPastDue = (dueDate: string) => {
    if (!dueDate) return false;

    // ensures full-day correctness
    const due = new Date(dueDate + "T23:59:59").getTime();
    return due < Date.now();
  };

  useEffect(() => {
    if (!unit?.id) return;

    const fetchAssessments = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8080/api/units/${unit.id}/assessments`,
          {
            headers: {
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load assessments");

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Assessment error:", err);
        setData({ unitId: unit.id, assessments: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [unit?.id]);

  if (!unit) {
    return (
      <div className="p-10 text-center text-red-500">
        Unit not found
      </div>
    );
  }

  return (
    <>
      <PageMeta title={unit.unitName} description="Unit details" />

      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-700 p-10 text-white mb-8">
        <p className="text-sm uppercase">{unit.unitCode}</p>
        <h1 className="text-3xl font-bold mt-2">{unit.unitName}</h1>
        <p className="mt-4">{unit.description}</p>
      </div>

      {/* MATERIALS */}
      <div className="rounded-2xl border mb-6 bg-white dark:bg-gray-900">
        <button
          onClick={() => setOpenMaterials(!openMaterials)}
          className="w-full px-6 py-5 flex justify-between"
        >
          <h2 className="font-semibold">Unit Materials</h2>
          <span>{openMaterials ? "−" : "+"}</span>
        </button>

        {openMaterials && (
          <div className="p-6 border-t">
            {unit.materials?.length ? (
              unit.materials.map((m) => (
                <a
                  key={m.id}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded mb-2 hover:bg-gray-50"
                >
                  {m.title}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No materials</p>
            )}
          </div>
        )}
      </div>

      {/* ASSESSMENTS */}
      <div className="rounded-2xl border bg-white dark:bg-gray-900">
        <button
          onClick={() => setOpenAssessments(!openAssessments)}
          className="w-full px-6 py-5 flex justify-between"
        >
          <h2 className="font-semibold">Assessments</h2>
          <span>{openAssessments ? "−" : "+"}</span>
        </button>

        {openAssessments && (
          <div className="p-6 border-t space-y-6">
            {loading ? (
              <p className="text-gray-500">Loading assessments...</p>
            ) : !data?.assessments?.length ? (
              <p className="text-gray-500">No assessments available</p>
            ) : (
              data.assessments.map((a) => {
                const pastDue = isPastDue(a.dueDate);
                const hasGrades = (a.grades?.length ?? 0) > 0;

                return (
                  <div key={a.id} className="border rounded-xl p-4">

                    {/* TOP SECTION */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {a.assessmentCode} - {a.assessmentName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Due: {a.dueDate} | Max: {a.maxMarks}
                        </p>
                      </div>

                      {/* SUBMIT BUTTON LOGIC */}
                      {!pastDue ? (
                        <a
                          href={`/submit-assessment/${a.id}`}
                          className="text-brand-500 font-semibold"
                        >
                          Submit →
                        </a>
                      ) : (
                        <span className="text-gray-400 font-semibold cursor-not-allowed">
                          Closed
                        </span>
                      )}
                    </div>

                    <p className="text-sm mt-2 text-gray-600">
                      {a.description}
                    </p>

                    {/* GRADES ONLY WHEN PAST DUE */}
                    {pastDue && hasGrades && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-2">
                          Grades
                        </h4>

                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2">Marks</th>
                              <th className="p-2">Grade</th>
                            </tr>
                          </thead>

                          <tbody>
                            {a.grades!.map((g, i) => (
                              <tr key={i} className="border-t">
                                <td className="p-2">{g.marks}</td>
                                <td className="p-2">{g.grade}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* NO GRADES MESSAGE */}
                    {pastDue && !hasGrades && (
                      <p className="text-sm text-gray-400 mt-3">
                        Grades not released yet
                      </p>
                    )}

                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}