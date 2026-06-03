import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { API_BASE_URL } from "../../api/Api";

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
  termId: number;
  termName: string;
  termStartDate: string;
  termEndDate: string;
  materials: Material[];
}

export default function StudentDashboard() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [studentInfo, setStudentInfo] = useState({ name: "Scholar", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setError("Student session not found. Please log in again.");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [userRes, unitsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/${userId}`, { headers }),
          fetch(`${API_BASE_URL}/api/courses/student/${userId}/units`, { headers }),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setStudentInfo({ name: userData.name, email: userData.email });
        }

        if (unitsRes.ok) {
          const unitsData = await unitsRes.json();
          setUnits(Array.isArray(unitsData) ? unitsData : unitsData.units || []);
        } else if (unitsRes.status === 403) {
          throw new Error("Access Denied (403): You do not have permission to view these academic records. Check your student role assignment.");
        } else {
          throw new Error(`Server Sync Failed: ${unitsRes.status}`);
        }
      } catch (err: any) {
        console.error("Dashboard Sync Error:", err);
        setError(err.message || "Unable to connect to the learning vault.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= CURRENT SEMESTER FILTER =================
  const isCurrentTerm = (start: string, end: string) => {
    const now = new Date().getTime();
    return (
      now >= new Date(start).getTime() &&
      now <= new Date(end).getTime()
    );
  };

  const currentUnits = units.filter((u) =>
    isCurrentTerm(u.termStartDate, u.termEndDate)
  );

  const upcomingUnits = units.filter(
    (u) => new Date(u.termStartDate).getTime() > new Date().getTime()
  );

  const completedUnits = units.filter(
    (u) => new Date(u.termEndDate).getTime() < new Date().getTime()
  );

  if (loading) return <div className="p-10 text-center text-gray-500 italic">Synchronizing academic records...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-medium">Error: {error}</div>;

  const chartData = [
    { name: "Completed", value: completedUnits.length, color: "#10b981" },
    { name: "In Progress", value: currentUnits.length, color: "#4f46e5" },
    { name: "Upcoming", value: upcomingUnits.length, color: "#f59e0b" },
  ];

  return (
    <>
      <PageMeta title="Student Dashboard" description="Student learning portal" />

      <div className="p-6 space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back, {studentInfo.name}! 🎓</h1>
            <p className="text-indigo-100 mt-1 text-sm font-medium opacity-80">{studentInfo.email}</p>
            <p className="text-indigo-100 mt-3 max-w-md">
              You have {currentUnits.length} active units this term. Keep up the great momentum!
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs uppercase font-bold opacity-70">Next Milestone</p>
              <p className="text-lg font-semibold">Term End: {currentUnits[0]?.termEndDate || "TBD"}</p>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Active Units", val: currentUnits.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Upcoming", val: upcomingUnits.length, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Completed", val: completedUnits.length, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <div className={`text-3xl font-black ${stat.color} mt-2`}>{stat.val}</div>
              <div className={`mt-3 h-1 w-12 rounded-full ${stat.bg.replace('bg-', 'bg-')}`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= CURRENT UNITS ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📚</span> Current Semester
                </h2>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
              </div>

              {currentUnits.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic bg-gray-50 rounded-xl">
                  No active units found for this semester.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {currentUnits.map((unit) => (
                    <div key={unit.id} className="group border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-tighter">
                          {unit.unitCode}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      </div>
                      <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {unit.unitName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {unit.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-indigo-600 uppercase">
                        <span>{unit.termName}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Enter Unit →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "My Grades", icon: "📊", color: "hover:bg-blue-50" },
                { label: "Schedule", icon: "📅", color: "hover:bg-purple-50" },
                { label: "Materials", icon: "📂", color: "hover:bg-emerald-50" },
                { label: "Support", icon: "💬", color: "hover:bg-rose-50" },
              ].map((act, i) => (
                <button key={i} className={`p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all flex flex-col items-center gap-2 group ${act.color}`}>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{act.icon}</span>
                  <span className="text-xs font-bold text-gray-600">{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PROGRESS & TIMELINE ================= */}
          <div className="space-y-6">
            {/* PROGRESS CHART */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Progress</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📅 Semester Timeline</h2>
              <div className="space-y-4">
                {currentUnits.slice(0, 4).map((unit) => (
                  <div key={unit.id} className="flex gap-4 items-start relative pb-4 last:pb-0">
                    <div className="flex-none w-2 h-2 mt-1.5 rounded-full bg-indigo-500 z-10"></div>
                    <div className="absolute left-[3.5px] top-4 w-[1px] h-full bg-gray-100 last:hidden"></div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gray-800 leading-none">{unit.unitName}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">Active Learning Node</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}