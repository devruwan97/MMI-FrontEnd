import { useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { courses, teachers, students, enrollments } from "../../../data/dummy";

type Tab = "courses" | "teachers" | "students" | "enrollments";

const tabs: Tab[] = ["courses", "teachers", "students", "enrollments"];

export default function ManagementPage() {
  const [tab, setTab] = useState<Tab>("courses");

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? styles.completed}`}>{status}</span>;
  };

  return (
    <>
      <PageMeta title="Management | Admin" description="Manage courses, teachers, students and enrollments" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all courses, teachers, students and enrollments</p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand-500 text-brand-600 dark:text-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t} ({
              t === "courses" ? courses.length
              : t === "teachers" ? teachers.length
              : t === "students" ? students.length
              : enrollments.length
            })
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{courses.length} total courses</p>
            <button className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">+ Add Course</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["ID", "Title", "Category", "Fee", "Capacity", "Units", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">#{c.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{c.title}</td>
                    <td className="px-5 py-3"><span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">{c.category}</span></td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">${c.fee}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{c.capacity}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{c.units.length}</td>
                    <td className="px-5 py-3 flex gap-2">
                      <button className="text-xs text-brand-500 hover:underline">Edit</button>
                      <button className="text-xs text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "teachers" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{teachers.length} total teachers</p>
            <button className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">+ Add Teacher</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Teacher", "Email", "Qualifications", "Available Days", "Courses", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">{t.name.charAt(0)}</div>
                        <span className="font-medium text-gray-800 dark:text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{t.email}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-xs max-w-[200px] truncate">{t.qualifications}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.availability.days.map((d) => (
                          <span key={d} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{d.slice(0, 3)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{t.courses.length}</td>
                    <td className="px-5 py-3 flex gap-2">
                      <button className="text-xs text-brand-500 hover:underline">Edit</button>
                      <button className="text-xs text-red-400 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "students" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{students.length} total students</p>
            <button className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">+ Add Student</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Student", "Email", "Date of Birth", "Parent/Guardian", "Address", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">{s.name.charAt(0)}</div>
                        <span className="font-medium text-gray-800 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{s.email}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-xs">{s.date_of_birth}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-xs">{s.parent_name}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs max-w-[180px] truncate">{s.address}</td>
                    <td className="px-5 py-3 flex gap-2">
                      <button className="text-xs text-brand-500 hover:underline">Edit</button>
                      <button className="text-xs text-red-400 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "enrollments" && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{enrollments.length} total enrollments</p>
            <button className="rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors">+ New Enrollment</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["#", "Student", "Course", "Status", "Enrolled At", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {enrollments.map((e) => {
                  const student = students.find((s) => s.id === e.student_id);
                  const course = courses.find((c) => c.id === e.course_id);
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-3 text-gray-400 text-xs">#{e.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{student?.name ?? "—"}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{course?.title ?? "—"}</td>
                      <td className="px-5 py-3">{statusBadge(e.status)}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{e.enrolled_at}</td>
                      <td className="px-5 py-3 flex gap-2">
                        <button className="text-xs text-brand-500 hover:underline">View</button>
                        <button className="text-xs text-red-400 hover:underline">Cancel</button>
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
