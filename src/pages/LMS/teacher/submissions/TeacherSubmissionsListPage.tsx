import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import PageMeta from "../../../../components/common/PageMeta";

interface Submission {
  id: number; // gradeId
  studentId: string;
  name: string;
  mark: number;
  grade: string;
  fileUrl?: string;
}

interface PendingSubmission {
  id: number;
  studentId: number;
  studentName: string;
  fileUrl: string;
  fileName: string;
}

export default function TeacherSubmissionsListPage() {
  const { assessmentId } = useParams();

  const [tab, setTab] = useState<"graded" | "pending">("graded");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [graded, setGraded] = useState<Submission[]>([]);
  const [pending, setPending] = useState<PendingSubmission[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMarks, setEditMarks] = useState<number | "">("");

  const [marksInput, setMarksInput] = useState<Record<number, number>>({});

  // ================= FETCH DATA (AUTO REFRESH CORE) =================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [gradesRes, gradedRes, pendingRes] = await Promise.all([
        fetch(
          `http://localhost:8080/api/assessment-grades/assessment/${assessmentId}`
        ),
        fetch(
          `http://localhost:8080/api/submissions/assessment/${assessmentId}/graded`
        ),
        fetch(
          `http://localhost:8080/api/submissions/assessment/${assessmentId}/pending`
        )
      ]);

      const gradesData = await gradesRes.json();
      const gradedData = await gradedRes.json();
      const pendingData = await pendingRes.json();

      const mappedGraded: Submission[] = gradesData.map((g: any) => {
        const submission = gradedData.find(
          (s: any) =>
            Number(s.studentId) === Number(g.studentId)
        );

        return {
          id: g.id,
          studentId: String(g.studentId),
          name:
            submission?.studentName ||
            g.studentName ||
            `Student ${g.studentId}`,
          mark: g.marks,
          grade: g.grade ?? "-",
          fileUrl: submission?.fileUrl || ""
        };
      });

      setGraded(mappedGraded);
      setPending(pendingData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (assessmentId) fetchData();
  }, [assessmentId, fetchData]);

  // ================= AUTO REFRESH ON RETURN =================
  useEffect(() => {
    const handleFocus = () => {
      if (assessmentId) fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [assessmentId, fetchData]);

  // ================= GRADE SUBMIT =================
  const handleGradeSubmit = async (
    studentId: number,
    gradeId?: number
  ) => {
    const marks =
      tab === "graded" ? editMarks : marksInput[studentId];

    if (marks === "" || marks === undefined || marks === null) {
      alert("Enter marks first");
      return;
    }

    const isUpdate = !!gradeId;

    try {
      const res = await fetch(
        isUpdate
          ? `http://localhost:8080/api/assessment-grades/${gradeId}`
          : `http://localhost:8080/api/assessment-grades`,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessmentId: Number(assessmentId),
            studentId,
            marks: Number(marks),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save grade");

      await res.json();

      setEditingId(null);
      setEditMarks("");

      // 🔥 IMPORTANT: refresh everything
      await fetchData();

      alert(isUpdate ? "Updated successfully" : "Graded successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving grade");
    }
  };

  const startEdit = (s: Submission) => {
    setEditingId(s.id);
    setEditMarks(s.mark);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditMarks("");
  };

  // ================= FILTERS =================
  const filteredGraded = graded
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.includes(search)
    )
    .sort((a, b) =>
      sortAsc ? a.mark - b.mark : b.mark - a.mark
    );

  const filteredPending = pending.filter(
    (s) =>
      (s.studentName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(s.studentId).includes(search)
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Submissions | LMS"
        description="Teacher grading panel"
      />

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Assessment Submissions
        </h1>
        <p className="text-sm text-emerald-100 mt-1">
          Assessment ID: {assessmentId}
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("graded")}
          className={`px-4 py-2 rounded-xl font-medium ${
            tab === "graded"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Graded
        </button>

        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded-xl font-medium ${
            tab === "pending"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          Pending Grading
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <input
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tab === "graded" && (
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-white"
          >
            Sort {sortAsc ? "↑" : "↓"}
          </button>
        )}
      </div>

      {/* ================= GRADED ================= */}
      {tab === "graded" && (
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 font-semibold">
            <div className="col-span-2">Student ID</div>
            <div className="col-span-2">Marks</div>
            <div className="col-span-2">Grade</div>
            <div className="col-span-3">Submission</div>
            <div className="col-span-3">Action</div>
          </div>

          {filteredGraded.map((s) => {
            const isEditing = editingId === s.id;

            return (
              <div
                key={s.id}
                className="grid grid-cols-12 px-4 py-4 border-t"
              >
                <div className="col-span-2">
                  {"MMIS" + s.studentId}
                </div>

                <div className="col-span-2">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-20 px-2 py-1 border rounded"
                      value={editMarks}
                      onChange={(e) =>
                        setEditMarks(Number(e.target.value))
                      }
                    />
                  ) : (
                    `${s.mark}%`
                  )}
                </div>

                <div className="col-span-2">{s.grade}</div>

                <div className="col-span-3 flex gap-2 items-center">
                  {s.fileUrl ? (
                    <a
                      href={s.fileUrl}
                      className="text-blue-600 underline"
                    >
                      View Submission
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      No submission
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex gap-2 items-center">
                  {!isEditing ? (
                    <button
                      onClick={() => startEdit(s)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-xl"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleGradeSubmit(
                            Number(s.studentId),
                            s.id
                          )
                        }
                        className="px-3 py-1 bg-emerald-600 text-white rounded-xl"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-400 text-white rounded-xl"
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
      )}

      {/* ================= PENDING ================= */}
      {tab === "pending" && (
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 font-semibold">
            <div className="col-span-4">Student</div>
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Submission</div>
            <div className="col-span-3">Grade</div>
          </div>

          {filteredPending.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-12 px-4 py-4 border-t"
            >
              <div className="col-span-4">
                {s.studentName}
              </div>
              <div className="col-span-2">{"MMIS"+s.studentId}</div>

              <div className="col-span-3">
                <a
                  href={s.fileUrl}
                  className="text-blue-600 underline"
                >
                  View Submission
                </a>
              </div>

              <div className="col-span-3 flex gap-2 items-center">
                <input
                  type="number"
                  className="w-20 border px-2 py-1 rounded"
                  onChange={(e) =>
                    setMarksInput({
                      ...marksInput,
                      [s.studentId]: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    handleGradeSubmit(s.studentId)
                  }
                  className="px-3 py-1 bg-emerald-600 text-white rounded"
                >
                  Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}