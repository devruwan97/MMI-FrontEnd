import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { getAuthHeaders } from "../../../api/Api";

export default function PaymentDetailsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/payments", {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // SAFE helpers
  const getStudentName = (p: any) =>
    p?.student?.user?.name || "Unknown Student";

  const getStudentId = (p: any) =>
    p?.student?.id ?? "—";

  const getCourseName = (p: any) =>
    p?.enrollment?.course?.title || "Unknown Course";

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const student = getStudentName(p).toLowerCase();
      const course = getCourseName(p).toLowerCase();
      const status = (p.status || "").toLowerCase();
      const term = search.toLowerCase();

      return (
        student.includes(term) ||
        course.includes(term) ||
        status.includes(term)
      );
    });
  }, [payments, search]);

  const stats = useMemo(() => {
    const total = filteredPayments.reduce(
      (acc, p) => acc + (p.finalAmount || 0),
      0
    );

    const pending = filteredPayments
      .filter((p) => p.status !== "paid")
      .reduce((acc, p) => acc + (p.finalAmount || 0), 0);

    return { total, pending };
  }, [filteredPayments]);

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payments/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading payment records...
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Payment Management | Admin"
        description="View all student transactions"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Global Payment Details
        </h1>
        <p className="text-gray-500">
          Monitor all financial transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border">
          <p>Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.total.toLocaleString()}
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border">
          <p>Outstanding</p>
          <p className="text-2xl font-bold text-red-500">
            ${stats.pending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search student, course, status..."
        className="mb-6 w-full max-w-md px-4 py-2 border rounded-xl"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500"
                >
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id} className="border-t">
                  {/* ✅ UPDATED: Student ID + Name */}
                  <td className="p-3 font-medium">
                    <div className="flex flex-col">
                      <span>
                        {getStudentName(p)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {getStudentId(p)}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-gray-600">
                    {getCourseName(p)}
                  </td>

                  <td className="p-3 font-bold">
                    ${Number(p.finalAmount || 0).toFixed(2)}
                  </td>

                  <td className="p-3">
                    <select
                      value={p.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          p.id,
                          e.target.value
                        )
                      }
                      className={`px-2 py-1 rounded text-xs ${
                        statusStyles[p.status] || ""
                      }`}
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">
                        Pending
                      </option>
                      <option value="overdue">
                        Overdue
                      </option>
                    </select>
                  </td>

                  <td className="p-3 text-gray-500 text-xs">
                    {p.paymentDate || "—"}
                  </td>

                  <td className="p-3 text-right">
                    <span className="text-xs text-gray-400">
                      #{p.id}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}