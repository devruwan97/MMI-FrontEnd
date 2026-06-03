import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdminDashboardDTO {
  totalUsers: number;
  activeCourses: number;
  pendingApprovals: number;
  totalRevenue: number;
  systemHealth: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/admin/stats", {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Fallback for demonstration if API isn't ready
          setData({
            totalUsers: 1248,
            activeCourses: 32,
            pendingApprovals: 7,
            totalRevenue: 15400,
            systemHealth: 98,
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Initializing Admin Panel...</div>;
  }

  const kpiData = [
    { name: "Total Users", value: data?.totalUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Active Courses", value: data?.activeCourses, color: "text-green-600", bg: "bg-green-50" },
    { name: "Pending Approvals", value: data?.pendingApprovals, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const chartData = [
    { name: "Students", value: 850 },
    { name: "Teachers", value: 320 },
    { name: "Admins", value: 78 },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

  return (
    <>
      <PageMeta title="Admin Dashboard" description="Admin control panel" />

      <div className="p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-gray-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel 🛠️</h1>
            <p className="text-slate-300 mt-2 max-w-md">
              Global system management, user orchestration, and platform health monitoring.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <p className="text-xs uppercase font-semibold opacity-60">System Health</p>
              <p className="text-xl font-bold text-green-400">{data?.systemHealth}%</p>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpiData.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.name}</div>
              <div className={`text-3xl font-black ${item.color} mt-2`}>
                {item.value?.toLocaleString()}
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <span className={`w-2 h-2 rounded-full mr-2 ${item.bg.replace('bg-', 'bg-')}`}></span>
                Live System Data
              </div>
            </div>
          ))}
        </div>

        {/* ================= ANALYTICS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">User Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Performance Snapshot</h2>
            <div className="space-y-6">
              {[
                { label: "User Growth", val: 85, color: "bg-blue-500" },
                { label: "Course Completion", val: 72, color: "bg-green-500" },
                { label: "Server Load", val: 42, color: "bg-purple-500" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-600">{stat.label}</span>
                    <span className="font-bold">{stat.val}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${stat.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${stat.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Administrative Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Users", desc: "Orchestrate accounts", icon: "👥", color: "hover:bg-blue-50 hover:border-blue-200 text-blue-600" },
              { label: "Course Management", desc: "Curate curriculum", icon: "📚", color: "hover:bg-green-50 hover:border-green-200 text-green-600" },
              { label: "Audit Logs", desc: "Security & activity", icon: "📋", color: "hover:bg-purple-50 hover:border-purple-200 text-purple-600" },
            ].map((action, i) => (
              <button key={i} className={`p-5 rounded-2xl border border-gray-100 transition-all text-left group ${action.color}`}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-bold">{action.label}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-600">{action.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ================= SYSTEM MODULES ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Configuration Nodes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "IAM", sub: "Access Control" },
              { title: "CMS", sub: "Content Engine" },
              { title: "Billing", sub: "Gateway Config" },
              { title: "SMTP", sub: "Mail Services" },
            ].map((node, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all cursor-pointer">
                <div className="text-sm font-bold text-slate-700">{node.title}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{node.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}