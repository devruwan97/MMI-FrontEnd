import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
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
  Legend
} from "recharts";
import { API_BASE_URL } from "../../api/Api";

interface DashboardDTO {
  totalUsers: number;
  totalStudents: number;
  totalUnits: number;
  totalAssessments: number;
  totalSubmissions: number;
}

export default function ManagementDashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/analytics/dashboard`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-10 text-red-500">Failed to load dashboard</div>;
  }

  const kpiData = [
    { name: "Users", value: data.totalUsers },
    { name: "Students", value: data.totalStudents },
    { name: "Units", value: data.totalUnits },
    { name: "Assessments", value: data.totalAssessments },
    { name: "Submissions", value: data.totalSubmissions }
  ];

  const submissionData = [
    { name: "Submitted", value: data.totalSubmissions },
    { name: "Remaining", value: Math.max(data.totalAssessments * 10 - data.totalSubmissions, 0) }
  ];

  const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <>
      <PageMeta title="Management Dashboard" description="LMS analytics overview" />

      <div className="p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">Management Analytics Dashboard 📊</h1>
          <p className="text-sm opacity-80 mt-1">
            System insights, performance metrics and learning analytics
          </p>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiData.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
              <div className="text-sm text-gray-500">{item.name}</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 rounded-xl border hover:bg-indigo-50 text-left">
              <div className="font-semibold text-indigo-600">📊 View Reports</div>
              <div className="text-sm text-gray-500">System performance reports</div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-green-50 text-left">
              <div className="font-semibold text-green-600">👨‍🎓 Student Analytics</div>
              <div className="text-sm text-gray-500">Performance insights</div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-purple-50 text-left">
              <div className="font-semibold text-purple-600">📚 Course Insights</div>
              <div className="text-sm text-gray-500">Unit & assessment stats</div>
            </button>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BAR CHART */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-4">System Overview</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpiData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="font-semibold mb-4">Submission Overview</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={submissionData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {submissionData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= LINE CHART ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="font-semibold mb-4">System Growth Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { month: "Jan", users: 200 },
                { month: "Feb", users: 400 },
                { month: "Mar", users: 650 },
                { month: "Apr", users: 900 },
                { month: "May", users: data.totalUsers }
              ]}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
}
