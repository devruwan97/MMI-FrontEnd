import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { schedules, courses, teachers } from "../../data/dummy";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function SchedulePage() {
  const [view, setView] = useState<"table" | "grid">("grid");

  const getScheduleForDay = (day: string) =>
    schedules
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const getCourseName = (id: number) => courses.find((c) => c.id === id)?.title ?? "—";
  const getTeacherName = (id: number) => teachers.find((t) => t.id === id)?.name ?? "—";
  const getCourseCategory = (courseId: number) => courses.find((c) => c.id === courseId)?.category ?? "";

  const categoryColors: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    English: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Science: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    Technology: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Humanities: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Arts: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  };

  return (
    <>
      <PageMeta title="Schedule | LMS" description="Weekly class schedule" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Class Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Weekly timetable for all courses – Term 1, 2026</p>
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
            <div key={day} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="bg-brand-500 px-4 py-3">
                <h3 className="font-semibold text-white text-sm">{day}</h3>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {getScheduleForDay(day).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center pt-4">No classes</p>
                ) : (
                  getScheduleForDay(day).map((s) => (
                    <div key={s.id} className={`rounded-lg p-2.5 text-xs ${categoryColors[getCourseCategory(s.course_id)] ?? "bg-gray-100 dark:bg-gray-800"}`}>
                      <p className="font-semibold">{getCourseName(s.course_id)}</p>
                      <p className="mt-0.5 opacity-80">{s.start_time} – {s.end_time}</p>
                      <p className="mt-0.5 opacity-70">{s.location}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Day", "Course", "Teacher", "Time", "Location", "Category"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-200">{s.day_of_week}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{getCourseName(s.course_id)}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{getTeacherName(s.teacher_id)}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{s.start_time} – {s.end_time}</td>
                    <td className="px-5 py-3 text-brand-500">{s.location}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[getCourseCategory(s.course_id)] ?? "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                        {getCourseCategory(s.course_id)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
