import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Course {
  id: number;
  title: string;
  category: string;
}

interface Unit {
  id: number;
  unitCode: string;
  unitName: string;
}

interface FinalGrade {
  studentId: number;
  studentName: string;
  finalMark: number | string; // IMPORTANT FIX
  grade: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function UnitAnalytics() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [grades, setGrades] = useState<FinalGrade[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [selectedUnit, setSelectedUnit] = useState<number | "">("");

  const [loadingGrades, setLoadingGrades] = useState(false);

  // ================= LOAD COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("http://localhost:8080/api/courses");
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  // ================= LOAD UNITS =================
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchUnits = async () => {
      const res = await fetch(
        `http://localhost:8080/api/courses/${selectedCourse}/units`
      );
      const data = await res.json();

      setUnits(data.units || []);
      setSelectedUnit("");
      setGrades([]);
    };

    fetchUnits();
  }, [selectedCourse]);

  // ================= LOAD GRADES =================
  useEffect(() => {
    if (!selectedUnit) return;

    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);

        const res = await fetch(
          `http://localhost:8080/api/grades/unit/${selectedUnit}/final`
        );

        const data = await res.json();
        setGrades(data);
      } catch (err) {
        console.error(err);
        setGrades([]);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, [selectedUnit]);

  // ================= NORMALIZE DATA (🔥 FIX) =================
  const safeGrades = useMemo(() => {
    return grades.map((g) => ({
      ...g,
      finalMark: Number(g.finalMark) || 0,
    }));
  }, [grades]);

  // ================= METRICS =================
  const avgMark = useMemo(() => {
    if (!safeGrades.length) return 0;

    const avg =
      safeGrades.reduce((sum, g) => sum + Number(g.finalMark), 0) /
      safeGrades.length;

    return Math.round(avg * 10) / 10;
  }, [safeGrades]);

  const passCount = safeGrades.filter((g) => g.finalMark >= 50).length;
  const failCount = safeGrades.length - passCount;

  const pieData = useMemo(() => {
    return [
      { name: "Pass", value: passCount },
      { name: "Fail", value: failCount },
    ];
  }, [passCount, failCount]);

  const gradeDistribution = useMemo(() => {
    const map: Record<string, number> = {};

    safeGrades.forEach((g) => {
      map[g.grade] = (map[g.grade] || 0) + 1;
    });

    return Object.keys(map).map((k) => ({
      grade: k,
      count: map[k],
    }));
  }, [safeGrades]);

  const selectedUnitName = units.find(
    (u) => u.id === selectedUnit
  )?.unitName;

  const showEmptyState = !selectedCourse || !selectedUnit;

  return (
    <>
      <PageMeta title="Unit Analytics" description="Final grade analytics" />

      <div className="min-h-screen bg-gray-50 p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">🎓 Unit Analytics</h1>
          <p className="text-sm opacity-80 mt-1">
            Track student performance, grades, and insights
          </p>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            className="p-3 rounded-xl border bg-white shadow"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">📚 Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            className="p-3 rounded-xl border bg-white shadow"
            value={selectedUnit}
            disabled={!selectedCourse}
            onChange={(e) => setSelectedUnit(Number(e.target.value))}
          >
            <option value="">📘 Select Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unitCode} - {u.unitName}
              </option>
            ))}
          </select>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {showEmptyState && (
          <div className="bg-white p-12 rounded-2xl shadow text-center border">
            <div className="text-5xl mb-3">📊</div>
            <h2 className="text-xl font-semibold text-gray-700">
              Select a course and unit
            </h2>
            <p className="text-gray-500 mt-2">
              Analytics will appear once both selections are made
            </p>
          </div>
        )}

        {/* ================= KPI CARDS ================= */}
        {selectedUnit && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white p-5 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Average Mark</p>
              <h2 className="text-2xl font-bold text-blue-600">
                {avgMark}%
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Pass Rate</p>
              <h2 className="text-2xl font-bold text-green-600">
                {safeGrades.length
                  ? Math.round((passCount / safeGrades.length) * 100)
                  : 0}
                %
              </h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Total Students</p>
              <h2 className="text-2xl font-bold text-purple-600">
                {safeGrades.length}
              </h2>
            </div>

          </div>
        )}

        {/* ================= CHARTS ================= */}
        {selectedUnit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PIE */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="font-semibold mb-4">Pass vs Fail</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={110}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="font-semibold mb-4">Grade Distribution</h2>

              {loadingGrades ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>
        )}

        {/* ================= TABLE ================= */}
        {selectedUnit && (
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-4">
              Student Results {selectedUnitName && `- ${selectedUnitName}`}
            </h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left bg-gray-50">
                  <th className="p-3">Student</th>
                  <th className="p-3">Mark</th>
                  <th className="p-3">Grade</th>
                </tr>
              </thead>

              <tbody>
                {safeGrades.map((g, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{g.studentName}</td>
                    <td className="p-3">{g.finalMark}</td>
                    <td className="p-3 font-semibold">{g.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
}