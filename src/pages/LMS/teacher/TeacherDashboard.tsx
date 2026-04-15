import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { courses, schedules, enrollments, students } from "../../../data/dummy";

// Simulating logged-in teacher #1 (Dr. Sarah Mitchell)
const TEACHER_ID = 1;
const TEACHER_NAME = "Dr. Sarah Mitchell";

type Tab = "courses" | "schedule" | "students";

export default function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>("courses");

  const myCourses = courses.filter((c) => c.created_by === TEACHER_ID);
  const mySchedules = schedules.filter((s) => s.teacher_id === TEACHER_ID);
  const myCourseIds = myCourses.map((c) => c.id);
  const myEnrollments = enrollments.filter((e) => myCourseIds.includes(e.course_id) && e.status === "active");

  const myStudentIds = [...new Set(myEnrollments.map((e) => e.student_id))];
  const myStudents = students.filter((s) => myStudentIds.includes(s.id));

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <PageMeta title="Teacher Dashboard | LMS" description="Teacher portal" />

      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <p className="text-green-100 text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold mt-0.5">{TEACHER_NAME}</h1>
        <div className="mt-3 flex gap-4 text-sm">
          <span className="bg-white/20 rounded-lg px-3 py-1">{myCourses.length} Courses</span>
          <span className="bg-white/20 rounded-lg px-3 py-1">{mySchedules.length} Sessions/week</span>
          <span className="bg-white/20 rounded-lg px-3 py-1">{myStudents.length} Students</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {(["courses", "schedule", "students"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand-500 text-brand-600 dark:text-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t} ({t === "courses" ? myCourses.length : t === "schedule" ? mySchedules.length : myStudents.length})
          </button>
        ))}
      </div>

      {/* My Courses */}
      {tab === "courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myCourses.map((c) => {
            const enrolled = enrollments.filter((e) => e.course_id === c.id && e.status === "active").length;
            return (
              <div key={c.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <img src={c.image} alt={c.title} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">{c.category}</span>
                  <h3 className="mt-2 font-semibold text-gray-800 dark:text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{enrolled}/{c.capacity} enrolled</span>
                    <span className="text-gray-500 dark:text-gray-400">{c.units.length} units</span>
                  </div>
                  {/* Capacity bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(enrolled / c.capacity) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule */}
      {tab === "schedule" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Day", "Course", "Time", "Location"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[...mySchedules]
                  .sort((a, b) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week))
                  .map((s) => {
                    const course = courses.find((c) => c.id === s.course_id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-200">{s.day_of_week}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{course?.title ?? "—"}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{s.start_time} – {s.end_time}</td>
                        <td className="px-5 py-4 text-brand-500">{s.location}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Students */}
      {tab === "students" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{myStudents.length} active students across your courses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Student", "Email", "Enrolled In", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {myStudents.map((s) => {
                  const studentEnrollments = myEnrollments.filter((e) => e.student_id === s.id);
                  const enrolledCourses = studentEnrollments.map((e) => courses.find((c) => c.id === e.course_id)?.title).filter(Boolean);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
                          <span className="font-medium text-gray-800 dark:text-white">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{s.email}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {enrolledCourses.map((title) => (
                            <span key={title} className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">{title}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Active</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
