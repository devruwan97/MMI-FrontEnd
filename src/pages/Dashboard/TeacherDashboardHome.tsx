import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { API_BASE_URL } from "../../api/Api";

interface TeacherDashboardDTO {
  assignedUnits: number;
  totalStudents: number;
  pendingGrades: number;
  avgEngagement: number;
}

export default function TeacherDashboardHome() {
  const [data, setData] = useState<TeacherDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/teacher/stats`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          // Fallback for demonstration
          setData({
            assignedUnits: 8,
            totalStudents: 156,
            pendingGrades: 12,
            avgEngagement: 84,
          });
        }
      } catch (err) {
        console.error("Failed to fetch teacher dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 italic">Synchronizing academic data...</div>;
  }

  const kpiData = [
    { name: "My Units", value: data?.assignedUnits, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Total Students", value: data?.totalStudents, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Pending Grades", value: data?.pendingGrades, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const gradingData = [
    { name: "Graded", value: 85, color: "#10b981" },
    { name: "Pending", value: 15, color: "#f59e0b" },
  ];

  const engagementData = [
    { unit: "Math A", engagement: 92 },
    { unit: "Phys 2", engagement: 78 },
    { unit: "CompSci", engagement: 88 },
    { unit: "Alg 12", engagement: 65 },
  ];

  return (
    <>
      <PageMeta title="Teacher Dashboard" description="Teacher panel" />

      <div className="p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Professor! 👨‍🏫</h1>
            <p className="text-teal-100 mt-2 max-w-md">
              You have {data?.pendingGrades} assignments awaiting review today.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs uppercase font-bold opacity-70">Engagement Score</p>
              <p className="text-xl font-bold text-teal-300">{data?.avgEngagement}%</p>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpiData.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.name}</div>
              <div className={`text-3xl font-black ${item.color} mt-2`}>
                {item.value}
              </div>
              <div className="mt-4 flex items-center text-[10px] text-gray-400 font-bold uppercase">
                <span className={`w-2 h-2 rounded-full mr-2 ${item.bg.replace('bg-', 'bg-')}`}></span>
                Active Node
              </div>
            </div>
          ))}
        </div>

        {/* ================= ANALYTICS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Grading Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradingData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Engagement by Unit</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <XAxis dataKey="unit" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="engagement" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Faculty Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Units", desc: "Curate assigned materials", icon: "📚", color: "hover:bg-emerald-50 text-emerald-600" },
              { label: "Create Assessment", desc: "Add quizzes or tasks", icon: "📝", color: "hover:bg-blue-50 text-blue-600" },
              { label: "Grade Submissions", desc: "Evaluate student work", icon: "📊", color: "hover:bg-orange-50 text-orange-600" },
            ].map((action, i) => (
              <button key={i} className={`p-5 rounded-2xl border border-gray-100 transition-all text-left group ${action.color}`}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-bold">{action.label}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-700">{action.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ================= WEEKLY PANEL ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📅 This Week Overview
          </h2>
          <div className="space-y-3">
            {[
              { title: "Maths - Year 12", sub: "Algebra Assessment Review", status: "Due Today", badge: "bg-rose-100 text-rose-600" },
              { title: "Physics - Unit 2", sub: "Lab Report Grading", status: "Pending", badge: "bg-amber-100 text-amber-600" },
              { title: "Computer Science", sub: "Project Submissions Review", status: "Completed", badge: "bg-emerald-100 text-emerald-600" },
            ].map((task, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{task.sub}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${task.badge}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PERFORMANCE INDICATORS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Class Performance Snapshot</h2>
          <div className="space-y-4">
            {[
              { label: "Student Pass Rate", val: 78, color: "bg-emerald-500" },
              { label: "Assignments Completed", val: 64, color: "bg-blue-500" },
              { label: "Average Attendance", val: 91, color: "bg-purple-500" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                  <span>{stat.label}</span>
                  <span>{stat.val}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${stat.color} h-full transition-all duration-1000`} style={{ width: `${stat.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}