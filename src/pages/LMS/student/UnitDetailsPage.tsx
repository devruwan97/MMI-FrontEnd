import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../api/Api";

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

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const isPastDue = (dueDate: string) => {
    if (!dueDate) return false;
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
          `${API_BASE_URL}/api/units/${unit.id}/assessments`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load assessments");

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
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

const handleSubmit = async () => {
  if (!selectedAssessment || !file) return;

  try {
    setSubmitting(true);

    const token = localStorage.getItem("token");

    const fakeFileUrl = `https://fake-storage.com/uploads/${Date.now()}-${file.name}`;

    const studentId = Number(localStorage.getItem("userId"));

    const payload = {
      assessmentId: selectedAssessment.id,
      studentId: studentId,
      fileName: file.name,
      fileUrl: fakeFileUrl
    };

    const res = await fetch(`${API_BASE_URL}/api/submissions/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data) {
      throw new Error(data?.message || "Submission failed");
    }

    alert(data.message || "Assessment submitted successfully!");

    // reset UI
    setSelectedAssessment(null);
    setFile(null);

  } catch (err) {
    console.error(err);
    alert("Submission failed. Try again.");
  } finally {
    setSubmitting(false);
  }
};

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
              <p>No materials</p>
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
          <div className="p-6 space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : !data?.assessments?.length ? (
              <p>No assessments</p>
            ) : (
              data.assessments.map((a) => {
                const pastDue = isPastDue(a.dueDate);
                const hasGrades = (a.grades?.length ?? 0) > 0;

                return (
                  <div key={a.id} className="border p-4 rounded-xl">

                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {a.assessmentCode} - {a.assessmentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Due: {a.dueDate}
                        </p>
                      </div>

                      {!pastDue ? (
                        <button
                          onClick={() => setSelectedAssessment(a)}
                          className="text-brand-500 font-semibold"
                        >
                          Submit →
                        </button>
                      ) : (
                        <span className="text-gray-400">Closed</span>
                      )}
                    </div>

                    {pastDue && hasGrades && (
                      <p className="mt-3 text-sm">
                        Grade: {a.grades![0].grade} ({a.grades![0].marks})
                      </p>
                    )}

                    {pastDue && !hasGrades && (
                      <p className="text-sm text-gray-400 mt-2">
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

      {selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 w-[400px] p-6 rounded-2xl">

            <h2 className="text-lg font-semibold mb-4">
              Submit: {selectedAssessment.assessmentName}
            </h2>

            {/* FILE INPUT */}
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!file || submitting}
                className="bg-brand-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}