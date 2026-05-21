import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import jsPDF from "jspdf";

interface StudentGrade {
  id: number;
  score: number;
  gradeCode: string;
  course?: {
    title: string;
  };
  unit?: {
    unitName: string;
  };
}

export default function MyResultsPage() {
  const [results, setResults] = useState<StudentGrade[]>([]);
  const [filteredCourse, setFilteredCourse] = useState<string>("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User not found. Please login again.");
      setIsLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/grades/student/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // ================= FILTER =================
  const courses = Array.from(
    new Set(results.map((r) => r.course?.title || "Unknown"))
  );

  const filteredResults =
    filteredCourse === "ALL"
      ? results
      : results.filter((r) => r.course?.title === filteredCourse);

  // ================= PDF DOWNLOAD =================
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Academic Results Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Course: ${filteredCourse}`, 20, 30);

    let y = 45;

    filteredResults.forEach((r, index) => {
      doc.text(
        `${index + 1}. ${r.unit?.unitName || "Unit"} | Score: ${r.score} | Grade: ${r.gradeCode}`,
        20,
        y
      );
      y += 10;
    });

    doc.save(`${filteredCourse}_results.pdf`);
  };

  return (
    <>
      <PageMeta
        title="My Results | Student"
        description="View your academic results"
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Results
        </h1>
        <p className="text-gray-500 mt-1 text-lg">
          Track your academic performance by course
        </p>
      </div>

      {/* FILTER + DOWNLOAD */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="px-4 py-3 border rounded-xl text-lg"
          value={filteredCourse}
          onChange={(e) => setFilteredCourse(e.target.value)}
        >
          <option value="ALL">All Courses</option>
          {courses.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-lg font-semibold hover:bg-emerald-700"
        >
          Download PDF
        </button>
      </div>

      {/* STATES */}
      {isLoading ? (
        <div className="py-20 text-center text-lg text-gray-500">
          Loading results...
        </div>
      ) : error ? (
        <div className="p-6 text-lg bg-red-50 text-red-600 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    {r.course?.title || "Course"}
                  </h2>
                  <p className="text-lg text-gray-500">
                    {r.unit?.unitName || "Unit"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-medium">
                    Score: {r.score}
                  </p>
                  <p className="text-xl font-bold text-emerald-600">
                    {r.gradeCode || "Not graded"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}