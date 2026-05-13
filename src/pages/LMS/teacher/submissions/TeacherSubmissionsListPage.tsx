import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";

interface Submission {
  id: number;
  studentId: string;
  name: string;
  mark: number;
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

  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ================= GRADED =================

        const gradedRes = await fetch(
          `http://localhost:8080/api/assessment-grades/assessment/${assessmentId}`
        );

        const gradedData = await gradedRes.json();

        const mappedGraded: Submission[] = gradedData.map((g: any) => ({
          id: g.id,
          studentId: String(g.studentId),
          name: g.studentName || `Student ${g.studentId}`,
          mark: g.marks,
        }));

        setGraded(mappedGraded);

        // ================= PENDING =================

        const pendingRes = await fetch(
          `http://localhost:8080/api/submissions/assessment/${assessmentId}/pending`
        );

        const pendingData = await pendingRes.json();

        setPending(pendingData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);

  // ================= FILTERS =================

  const filteredGraded = graded
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.includes(search)
    )
    .sort((a, b) => (sortAsc ? a.mark - b.mark : b.mark - a.mark));

  const filteredPending = pending.filter(
    (s) =>
      (s.studentName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(s.studentId).includes(search)
  );

  // ================= LOADING =================

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
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-xl"
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

      {/* ================= GRADED TAB ================= */}

      {tab === "graded" && (
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 font-semibold">
            <div className="col-span-4">Student</div>
            <div className="col-span-3">ID</div>
            <div className="col-span-2">Mark</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          {filteredGraded.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No graded submissions
            </div>
          ) : (
            filteredGraded.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-12 px-4 py-4 border-t"
              >
                <div className="col-span-4">{s.name}</div>

                <div className="col-span-3">{s.studentId}</div>

                <div className="col-span-2 font-bold">
                  {s.mark}%
                </div>

                <div className="col-span-3 text-right">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Graded
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= PENDING TAB ================= */}

      {tab === "pending" && (
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 font-semibold">
            <div className="col-span-4">Student</div>
            <div className="col-span-2">ID</div>
            <div className="col-span-3">Submission</div>
            <div className="col-span-3 text-right">Action</div>
          </div>

          {filteredPending.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pending submissions
            </div>
          ) : (
            filteredPending.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-12 px-4 py-4 border-t"
              >
                <div className="col-span-4">
                  {s.studentName || `Student ${s.studentId}`}
                </div>

                <div className="col-span-2">
                  {s.studentId}
                </div>

                <div className="col-span-3">
                  <a
                    href={s.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Submission
                  </a>
                </div>

                <div className="col-span-3 text-right">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl">
                    Grade
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}