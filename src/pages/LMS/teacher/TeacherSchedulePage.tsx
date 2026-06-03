import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL, getAuthHeaders } from "../../../api/Api";

// Simulating logged-in teacher #1 (Dr. Sarah Mitchell)
const TEACHER_ID = 1;

export default function TeacherSchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "grid">("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeaders();
        const [sRes, cRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/schedules`, { headers }),
          fetch(`${API_BASE_URL}/api/courses`, { headers }),
        ]);

        if (sRes.ok) setSchedules(await sRes.json());
        if (cRes.ok) setCourses(await cRes.json());
      } catch (err) {
        console.error("Error loading schedule data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mySchedules = useMemo(() => 
    schedules.filter((s) => s.teacher_id === TEACHER_ID || s.teacher?.id === TEACHER_ID), 
    [schedules]
  );

  const getCourse = (id: number) => courses.find((c) => c.id === id);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getScheduleForDay = (day: string) =>
    mySchedules
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const categoryColors: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    English: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Science: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    Technology: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Humanities: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Arts: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Loading your schedule...</div>;
  }

  return (
    <>
      <PageMeta title="My Schedule | Teacher" description="View your weekly teaching schedule" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Personal weekly timetable for your assigned courses</p>
        </div>
        <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button onClick={() => setView("grid")} className={`px-4 py-2 text-sm font-medium transition-colors ${view === "grid" ? "bg-brand-500 text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            Timetable
          </button>
          <button onClick={() => setView("table")} className={`px-4 py-2 text-sm font-medium transition-colors ${view === "table" ? "bg-brand-500 text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
            List
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
              <div className="bg-brand-500 px-4 py-3 text-center">
                <h3 className="font-bold text-white text-sm">{day}</h3>
              </div>
              <div className="p-3 space-y-3 min-h-[150px]">
                {getScheduleForDay(day).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center pt-8 italic">No classes</p>
                ) : (
                  getScheduleForDay(day).map((s) => {
                    const course = getCourse(s.course_id);
                    return (
                      <div key={s.id} className={`rounded-xl p-3 text-xs border-l-4 ${categoryColors[course?.category || ''] || "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"} shadow-sm transition-transform hover:scale-[1.02]`}>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{course?.title || "Unknown Course"}</p>
                        <p className="mt-1 font-medium opacity-90">{s.start_time} – {s.end_time}</p>
                        <div className="mt-2 flex items-center justify-between opacity-70">
                          <span>{s.location}</span>
                          <span className="font-mono text-[10px]">#{s.id}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  {["Day", "Course", "Time", "Location", "Category"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {mySchedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No sessions scheduled yet.</td>
                  </tr>
                ) : (
                  [...mySchedules]
                    .sort((a, b) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week) || a.start_time.localeCompare(b.start_time))
                    .map((s) => {
                      const course = getCourse(s.course_id);
                      return (
                        <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                          <td className="px-5 py-4 font-bold text-gray-700 dark:text-gray-200">{s.day_of_week}</td>
                          <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">{course?.title || "—"}</td>
                          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.start_time} – {s.end_time}</td>
                          <td className="px-5 py-4 text-brand-500 font-semibold">{s.location}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${categoryColors[course?.category || ''] || "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                              {course?.category || "Other"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}