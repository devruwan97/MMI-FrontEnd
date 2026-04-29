import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { getAuthHeaders } from "../../../api/Api";

export default function PaymentDetailsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes, cRes] = await Promise.all([
          fetch("http://localhost:8080/api/payments", { headers: getAuthHeaders() }),
          fetch("http://localhost:8080/api/students", { headers: getAuthHeaders() }),
          fetch("http://localhost:8080/api/courses", { headers: getAuthHeaders() }),
        ]);

        if (pRes.ok) setPayments(await pRes.json());
        if (sRes.ok) setStudents(await sRes.json());
        if (cRes.ok) setCourses(await cRes.json());
      } catch (err) {
        console.error("Error loading payment management data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (paymentId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/payments/${paymentId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.user?.name || `Student #${studentId}` : `ID: ${studentId}`;
  };

  const getCourseName = (enrollmentId: number) => {
    // In a real scenario, payments usually link to enrollments which link to courses.
    // For this UI, we'll find the payment and match its amount to course fees as a fallback logic
    const p = payments.find((pay) => pay.enrollment_id === enrollmentId);
    if (!p) return "—";
    return courses.find((c) => c.fee === p.amount)?.title ?? `Enrollment #${enrollmentId}`;
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const studentName = getStudentName(p.student_id).toLowerCase();
      const courseName = getCourseName(p.enrollment_id).toLowerCase();
      const searchTerm = search.toLowerCase();
      return studentName.includes(searchTerm) || courseName.includes(searchTerm) || p.status.includes(searchTerm);
    });
  }, [payments, students, courses, search]);

  const stats = useMemo(() => {
    const total = filteredPayments.reduce((acc, p) => acc + p.final_amount, 0);
    const pending = filteredPayments.filter(p => p.status !== 'paid').reduce((acc, p) => acc + p.final_amount, 0);
    return { total, pending };
  }, [filteredPayments]);

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading payment records...</div>;
  }

  return (
    <>
      <PageMeta title="Payment Management | Admin" description="View all student transactions" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Global Payment Details</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage all financial transactions across the institute</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Collected Revenue</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">${stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding Balance</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">${stats.pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student, course or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400">Student</th>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400">Course</th>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400">Final Amount</th>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-5 py-4 font-semibold text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">No payment records found matching your search.</td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800 dark:text-white">
                        {getStudentName(p.student_id)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {getCourseName(p.enrollment_id)}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      ${p.final_amount.toFixed(2)}
                      {p.amount !== p.final_amount && (
                        <span className="block text-[10px] text-green-500 font-normal">Discount Applied</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusUpdate(p.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer appearance-none transition-all ${
                          statusStyles[p.status] || "bg-gray-100"
                        }`}
                      >
                        <option value="paid" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">Paid</option>
                        <option value="pending" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">Pending</option>
                        <option value="overdue" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">Overdue</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {p.payment_date || "Pending"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {p.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(p.id, "paid")}
                            className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                          >
                            Approve Payment
                          </button>
                        )}
                        <span className="text-gray-400 text-[10px] font-mono">ID: #{p.id}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}