import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../../api/Api";

interface Enrollment {
  student: {
    id: number;
    user: {
      name: string;
    };
  };
}

interface FinalGrade {
  id?: number;
  studentId: number;
  studentName: string;
  score: number | "";
  grade: string;
  isNew?: boolean;
}

export default function UnitFinalGradesPage() {
  const { courseId, unitId } = useParams();

  const [rows, setRows] = useState<FinalGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number | "">("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [enrollRes, gradeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/enrollments/course/${courseId}`),
        fetch(`${API_BASE_URL}/api/grades/unit/${unitId}/final`)
      ]);

      const enrollments: Enrollment[] = await enrollRes.json();
      const grades: any[] = await gradeRes.json();

      const students = enrollments.map((e) => ({
        studentId: e.student.id,
        studentName: e.student.user.name
      }));

      const mapped: FinalGrade[] = students.map((s) => {
        const match = grades.find(
          (g) => Number(g.studentId) === Number(s.studentId)
        );

        return {
          id: match?.id,
          studentId: s.studentId,
          studentName: s.studentName,
          score: match?.score ?? "",
          grade: match?.grade ?? "Not graded",
          isNew: !match
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    if (unitId) fetchData();
  }, [unitId, fetchData]);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData]);

const handleSave = async (row: FinalGrade) => {
  if (editScore === "" || editScore === null) {
    alert("Enter score first");
    return;
  }

  try {
    const enrollRes = await fetch(
      `${API_BASE_URL}/api/enrollments/course/${courseId}`
    );

    const enrollments = await enrollRes.json();

    const enrollment = enrollments.find(
      (e: any) => e.student.id === row.studentId
    );

    if (!enrollment) {
      alert("Enrollment not found for student");
      return;
    }

    const payload = {
      studentId: row.studentId,
      courseId: Number(courseId),
      unitId: Number(unitId),
      enrollmentId: enrollment.id,
      score: Number(editScore),
    };

    const res = await fetch(
      `${API_BASE_URL}/api/grades/add?teacherId=${localStorage.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    setEditRowId(null);
    setEditScore("");

    await fetchData();
  } catch (err) {
    console.error(err);
    alert("Error saving grade");
  }
};

  const filtered = rows.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      String(r.studentId).includes(search)
  );

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <PageMeta
        title="Final Grades | LMS"
        description="Unit final grades management"
      />

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Unit Final Grades</h1>
        <p className="text-sm text-emerald-100 mt-1">
          Unit ID: {unitId}
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 font-semibold">
          <div className="col-span-4">Student</div>
          <div className="col-span-2">Student ID</div>
          <div className="col-span-2">Score</div>
          <div className="col-span-2">Grade</div>
          <div className="col-span-2">Action</div>
        </div>

        {filtered.map((r) => {
          const isEditing = editRowId === r.studentId;

          return (
            <div
              key={r.studentId}
              className="grid grid-cols-12 px-4 py-4 border-t"
            >
              <div className="col-span-4">{r.studentName}</div>

              <div className="col-span-2">MMIS{r.studentId}</div>

              <div className="col-span-2">
                {isEditing ? (
                  <input
                    type="number"
                    className="w-20 border px-2 py-1 rounded"
                    value={editScore}
                    onChange={(e) =>
                      setEditScore(Number(e.target.value))
                    }
                  />
                ) : (
                  r.score !== "" ? `${r.score}` : "-"
                )}
              </div>

              <div className="col-span-2 font-semibold">
                {r.grade}
              </div>

              <div className="col-span-2 flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setEditRowId(r.studentId);
                      setEditScore(r.score);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    {r.isNew ? "Grade" : "Edit"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSave(r)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditRowId(null);
                        setEditScore("");
                      }}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}