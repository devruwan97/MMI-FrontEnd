import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { payments, discounts, students, courses } from "../../data/dummy";

export default function PaymentsPage() {
  const [tab, setTab] = useState<"payments" | "discounts">("payments");

  const getStudentName = (id: number) => students.find((s) => s.id === id)?.name ?? "—";
  const getCourseName = (enrollmentId: number) => {
    const p = payments.find((pay) => pay.enrollment_id === enrollmentId);
    if (!p) return "—";
    // just use the course fee lookup via enrollment to identify course
    return courses.find((c) => c.fee === p.amount)?.title ?? `Enrollment #${enrollmentId}`;
  };

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.final_amount, 0);
  const totalPending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.final_amount, 0);
  const totalSaved = payments.reduce((s, p) => s + (p.amount - p.final_amount), 0);

  return (
    <>
      <PageMeta title="Payments & Discounts | LMS" description="Payment records and discount information" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payments & Discounts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track payment records and available discount programs</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">${totalPending.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Discounts Applied</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">${totalSaved.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {(["payments", "discounts"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "payments" ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["#", "Student", "Course", "Original", "Discount", "Final", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">#{p.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-200">{getStudentName(p.student_id)}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{getCourseName(p.enrollment_id)}</td>
                    <td className="px-5 py-3 text-gray-500">${p.amount}</td>
                    <td className="px-5 py-3 text-brand-500 text-xs">{p.discount_applied ?? "—"}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white">${p.final_amount.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{p.payment_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((d) => (
            <div key={d.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">{d.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500"}`}>
                  {d.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-brand-600 dark:text-brand-400">
                {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                <span className="text-sm font-normal text-gray-400 ml-1">off</span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{d.condition}</p>
              <div className="mt-3">
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">{d.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
