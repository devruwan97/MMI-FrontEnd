import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { courses, stats, enrollments } from "../../data/dummy";

const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function LMSHome() {
  const recentEnrollments = enrollments.slice(0, 5);

  return (
    <>
      <PageMeta title="LMS Dashboard" description="Learning Management System Overview" />

      {/* Hero Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome to Mathsmastery Institute</h1>
        <p className="mt-2 text-brand-100">Empowering students and teachers through quality education.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/courses" className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors">
            Browse Courses
          </Link>
          <Link to="/contact" className="rounded-lg border border-white px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 mb-6">
        <StatCard label="Total Students" value={stats.totalStudents} color="text-brand-600 dark:text-brand-400" />
        <StatCard label="Teachers" value={stats.totalTeachers} color="text-green-600 dark:text-green-400" />
        <StatCard label="Courses" value={stats.totalCourses} color="text-purple-600 dark:text-purple-400" />
        <StatCard label="Active Enrollments" value={stats.activeEnrollments} color="text-orange-500 dark:text-orange-400" />
        <StatCard label="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="text-teal-600 dark:text-teal-400" />
        <StatCard label="Pending Payments" value={`$${stats.pendingPayments}`} color="text-red-500 dark:text-red-400" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Featured Courses */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Featured Courses</h2>
              <Link to="/courses" className="text-sm text-brand-500 hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.slice(0, 4).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group block rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  <img src={course.image} alt={course.title} className="h-36 w-full object-cover group-hover:opacity-90 transition-opacity" />
                  <div className="p-3">
                    <span className="text-xs font-medium text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">{course.category}</span>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white text-sm">{course.title}</p>
                    <p className="mt-1 text-sm font-bold text-brand-600 dark:text-brand-400">${course.fee}<span className="text-xs text-gray-400 font-normal">/term</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Enrollments</h2>
            <ul className="space-y-3">
              {recentEnrollments.map((enr) => {
                const course = courses.find((c) => c.id === enr.course_id);
                return (
                  <li key={enr.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">{course?.title}</p>
                      <p className="text-gray-400 text-xs">Student #{enr.student_id} · {enr.enrolled_at}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      enr.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : enr.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {enr.status}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link to="/admin/management" className="mt-4 block text-center text-sm text-brand-500 hover:underline">Manage Enrollments →</Link>
          </div>

          {/* Quick Links */}
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Quick Links</h2>
            <div className="space-y-2">
              {[
                { label: "View Schedule", path: "/schedule" },
                { label: "Payments & Discounts", path: "/payments" },
                { label: "Analytics Dashboard", path: "/admin/analytics" },
                { label: "Teacher Dashboard", path: "/teacher/dashboard" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {link.label}
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
