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
  LineChart,
  Line,
} from "recharts";

interface Course {
  id: number;
  title: string;
  fee: number;
  capacity: number;
}

interface Enrollment {
  id: number;
  enrolledAt: string;
  courseId: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function FinancialAnalytics() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [year, setYear] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [courseRes, enrollRes] = await Promise.all([
          fetch("http://localhost:8080/api/courses"),
          fetch("http://localhost:8080/api/enrollments"),
        ]);

        const coursesData = await courseRes.json();
        const enrollData = await enrollRes.json();

        setCourses(coursesData);
        setEnrollments(enrollData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================= FILTER BY YEAR =================
  const filteredEnrollments = useMemo(() => {
    if (year === "all") return enrollments;

    return enrollments.filter(
      (e) =>
        new Date(e.enrolledAt).getFullYear().toString() === year
    );
  }, [enrollments, year]);

  // ================= REVENUE PER COURSE =================
  const revenueData = useMemo(() => {
    return courses.map((course) => {
      const count = filteredEnrollments.filter(
        (e) => e.courseId === course.id
      ).length;

      return {
        name: course.title,
        revenue: count * course.fee,
        students: count,
      };
    });
  }, [courses, filteredEnrollments]);

  // ================= TOTAL REVENUE =================
  const totalRevenue = useMemo(() => {
    return revenueData.reduce((sum, c) => sum + c.revenue, 0);
  }, [revenueData]);

  // ================= TOP COURSE =================
  const topCourse = useMemo(() => {
    return [...revenueData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [revenueData]);

  // ================= EMPTY STATE =================
  if (!loading && courses.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold">No financial data found</h2>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Financial Analytics"
        description="Revenue insights dashboard"
      />

      <div className="min-h-screen bg-gray-50 p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">💰 Financial Analytics</h1>
          <p className="text-sm opacity-80 mt-1">
            Revenue insights across courses and enrollments
          </p>

          <select
            className="mt-4 p-2 rounded text-black"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">Total Enrollments</p>
            <h2 className="text-2xl font-bold text-blue-600">
              {filteredEnrollments.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border">
            <p className="text-gray-500 text-sm">Top Course</p>
            <h2 className="text-lg font-bold text-purple-600">
              {topCourse?.name || "N/A"}
            </h2>
          </div>

        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BAR CHART */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-4">
              Revenue per Course
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-4">
              Enrollment Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="students"
                  nameKey="name"
                  outerRadius={120}
                >
                  {revenueData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="font-semibold mb-4">
            Financial Breakdown
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-3">Course</th>
                <th className="p-3">Students</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {revenueData.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.students}</td>
                  <td className="p-3">
                    ${courses[i]?.fee || 0}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    ${r.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}