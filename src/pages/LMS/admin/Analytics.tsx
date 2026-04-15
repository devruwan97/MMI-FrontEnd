import PageMeta from "../../../components/common/PageMeta";
import { courses, enrollments, payments, students, teachers } from "../../../data/dummy";

const StatCard = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function AnalyticsPage() {
  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.final_amount, 0);
  const totalOutstanding = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.final_amount, 0);
  const activeEnrollments = enrollments.filter((e) => e.status === "active").length;

  // Enrollments per course
  const enrollmentsByCourse = courses.map((c) => ({
    title: c.title,
    count: enrollments.filter((e) => e.course_id === c.id).length,
    category: c.category,
    fee: c.fee,
  }));

  // Revenue per course (estimated)
  const revenueByCourse = courses.map((c) => {
    const courseEnrollments = enrollments.filter((e) => e.course_id === c.id);
    const revenue = courseEnrollments.reduce((sum, enr) => {
      const p = payments.find((pay) => pay.enrollment_id === enr.id);
      return sum + (p?.final_amount ?? 0);
    }, 0);
    return { title: c.title, revenue };
  });

  // Status distribution
  const statusDist = {
    active: enrollments.filter((e) => e.status === "active").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
  };

  const paymentDist = {
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "pending").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
  };

  const maxEnrollment = Math.max(...enrollmentsByCourse.map((c) => c.count), 1);

  return (
    <>
      <PageMeta title="Analytics | Admin" description="LMS Analytics Dashboard" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of system performance and metrics – Term 1, 2026</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Students" value={students.length} color="text-brand-600 dark:text-brand-400" />
        <StatCard label="Teachers" value={teachers.length} color="text-green-600 dark:text-green-400" />
        <StatCard label="Courses" value={courses.length} color="text-purple-600 dark:text-purple-400" />
        <StatCard label="Active Enrollments" value={activeEnrollments} color="text-orange-500 dark:text-orange-400" />
        <StatCard label="Revenue Collected" value={`$${totalRevenue.toFixed(0)}`} color="text-teal-600 dark:text-teal-400" />
        <StatCard label="Outstanding" value={`$${totalOutstanding.toFixed(0)}`} color="text-red-500 dark:text-red-400" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Enrollments per Course */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-5">Enrollments per Course</h2>
            <div className="space-y-4">
              {enrollmentsByCourse.map((c) => (
                <div key={c.title}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[60%]">{c.title}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{c.count} student{c.count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2.5 rounded-full bg-brand-500 transition-all"
                      style={{ width: `${(c.count / maxEnrollment) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution cards */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Enrollment status */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Enrollment Status</h2>
            <div className="space-y-3">
              {Object.entries(statusDist).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-300">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-2 rounded-full ${status === "active" ? "bg-green-500" : status === "pending" ? "bg-yellow-400" : "bg-gray-400"}`}
                        style={{ width: `${(count / enrollments.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment status */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Payment Status</h2>
            <div className="space-y-3">
              {Object.entries(paymentDist).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-gray-600 dark:text-gray-300">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-2 rounded-full ${status === "paid" ? "bg-green-500" : status === "pending" ? "bg-yellow-400" : "bg-red-500"}`}
                        style={{ width: `${(count / payments.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue table */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white">Revenue by Course</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {["Course", "Category", "Fee/Term", "Enrollments", "Revenue Collected"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {courses.map((c) => {
                    const rev = revenueByCourse.find((r) => r.title === c.title);
                    const enrCount = enrollmentsByCourse.find((e) => e.title === c.title);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{c.title}</td>
                        <td className="px-5 py-3"><span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">{c.category}</span></td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">${c.fee}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{enrCount?.count ?? 0}</td>
                        <td className="px-5 py-3 font-semibold text-green-600 dark:text-green-400">${(rev?.revenue ?? 0).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
