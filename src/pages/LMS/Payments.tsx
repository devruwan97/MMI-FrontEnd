import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [siblingGroup, setSiblingGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"payments" | "discounts">("payments");
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  // Mocking student ID 2 (Ava Smith) - in a production app, this should come from your Auth session/context
  const currentStudentId = 2;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [pRes, dRes, cRes, siRes] = await Promise.all([
          fetch("http://localhost:8080/api/payments", { headers }),
          fetch("http://localhost:8080/api/discounts", { headers }),
          fetch("http://localhost:8080/api/courses", { headers }),
          fetch(`http://localhost:8080/api/siblings/student/${currentStudentId}`, { headers }),
        ]);

        if (pRes.ok) setPayments(await pRes.json());
        if (dRes.ok) setDiscounts(await dRes.json());
        if (cRes.ok) setCourses(await cRes.json());
        if (siRes.ok) setSiblingGroup(await siRes.json());
      } catch (err) {
        console.error("Error loading payment data from API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentStudentId]);

  const mySiblings = useMemo(() => 
    siblingGroup?.siblings?.filter((s: any) => s.id !== currentStudentId) || []
  , [siblingGroup, currentStudentId]);

  const hasSiblings = mySiblings.length > 0;
  const displayPayments = useMemo(() => 
    payments.filter((p) => p.student_id === currentStudentId)
  , [payments, currentStudentId]);

  // Card type detection logic
  const cardType = useMemo(() => {
    const num = cardDetails.number.replace(/\s+/g, '');
    if (num.startsWith('4')) return "visa";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(num)) return "mastercard";
    return null;
  }, [cardDetails.number]);

  const manualCourse = useMemo(() => 
    courses.find(c => c.id === selectedCourseId)
  , [selectedCourseId, courses]);

  const manualDiscount = useMemo(() => 
    hasSiblings && manualCourse ? manualCourse.fee * 0.1 : 0
  , [hasSiblings, manualCourse]);

  const manualFinalTotal = useMemo(() => 
    manualCourse ? manualCourse.fee - manualDiscount : 0
  , [manualCourse, manualDiscount]);

  const getCourseName = (enrollmentId: number) => {
    const p = payments.find((pay) => pay.enrollment_id === enrollmentId);
    if (!p) return "—";
    // just use the course fee lookup via enrollment to identify course
    return courses.find((c) => c.fee === p.amount)?.title ?? `Enrollment #${enrollmentId}`;
  };

  const handlePay = (payment: any) => {
    const courseName = getCourseName(payment.enrollment_id);
    const isSiblingDiscount = payment.discount_applied === "Sibling Discount" || (hasSiblings && !payment.discount_applied);
    
    alert(
      `Checkout Details for ${courseName}\n` +
      `----------------------------------\n` +
      `Original Fare: $${payment.amount}\n` +
      `Sibling Discount: ${isSiblingDiscount ? '10% Applied' : 'Not Eligible'}\n` +
      `Total Due: $${payment.final_amount.toFixed(2)}`
    );
  };

  const handleManualPayment = () => {
    if (!manualCourse) return;
    
    // Basic validation
    const isCardValid = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardDetails.number);
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(cardDetails.expiry);
    const isCvvValid = /^\d{3}$/.test(cardDetails.cvv);

    if (!isCardValid || !isExpiryValid || !isCvvValid) {
      alert("Invalid card details. Please check the format (XXXX XXXX XXXX XXXX, MM/YY, XXX).");
      return;
    }

    // Simulate Payment Verification
    // Let's assume '4242 4242 4242 4242' is a test card for failure
    if (cardDetails.number === "4242 4242 4242 4242") {
      navigate("/payment-failure");
    } else {
      // On success, redirect to success page
      navigate("/payment-success");
    }
  };

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const totalPaid = useMemo(() => 
    displayPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.final_amount, 0)
  , [displayPayments]);

  const totalPending = useMemo(() => 
    displayPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.final_amount, 0)
  , [displayPayments]);

  const totalSaved = useMemo(() => 
    displayPayments.reduce((s, p) => s + (p.amount - p.final_amount), 0)
  , [displayPayments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading billing information...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Payments & Discounts | LMS" description="Payment records and discount information" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Payments & Discounts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your billing history and check sibling discount status</p>
        </div>
        <button 
          onClick={() => setShowManualForm(!showManualForm)}
          className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
        >
          {showManualForm ? "Cancel Payment" : "Make a Payment"}
        </button>
      </div>

      {/* Manual Payment Section */}
      {showManualForm && (
        <div className="mb-6 p-6 rounded-2xl border border-brand-200 bg-white dark:bg-gray-900 dark:border-brand-800/30 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">New Course Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Course</label>
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} - ${c.fee}</option>
                  ))}
                </select>
              </div>

              {selectedCourseId !== "" && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Card Information</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        value={cardDetails.number}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setCardDetails({...cardDetails, number: formatted});
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                        {cardType === "visa" && (
                          <span className="text-[10px] font-black italic text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            VISA
                          </span>
                        )}
                        {cardType === "mastercard" && (
                          <div className="flex items-center -space-x-1.5">
                            <div className="w-4 h-4 rounded-full bg-red-500/90 shadow-sm"></div>
                            <div className="w-4 h-4 rounded-full bg-amber-500/90 shadow-sm"></div>
                          </div>
                        )}
                        {!cardType && cardDetails.number.length > 0 && (
                          <span className="text-[18px]">💳</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {manualCourse && (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Course Fee:</span>
                  <span className="font-medium text-gray-800 dark:text-white">${manualCourse.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sibling Discount (10%):</span>
                  <span className={hasSiblings ? "font-bold text-green-600" : "text-gray-400"}>
                    {hasSiblings ? `-$${manualDiscount.toFixed(2)}` : "$0.00 (Not Eligible)"}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-800 dark:text-white">Total Due:</span>
                  <span className="text-2xl font-black text-brand-600">${manualFinalTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleManualPayment}
                  className="w-full mt-4 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-all active:scale-95 shadow-lg shadow-brand-500/20"
                >
                  Confirm & Pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sibling Discount Section */}
      <div className={`mb-6 p-6 rounded-2xl border transition-all ${
        hasSiblings 
          ? "bg-brand-50 border-brand-200 dark:bg-brand-900/10 dark:border-brand-800/30" 
          : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-800"
      }`}>
        <div className="flex gap-4 items-center">
          <div className={`h-12 w-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl ${
            hasSiblings ? "bg-white text-brand-600 dark:bg-gray-900" : "bg-gray-200 text-gray-400 dark:bg-gray-800"
          }`}>
            {hasSiblings ? "👨‍👩‍👧‍👦" : "👤"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Sibling Discount Policy
            </h3>
            {hasSiblings ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="text-green-600 font-bold">Eligibility Confirmed:</span> We've identified your sibling(s) 
                <span className="font-bold"> {mySiblings.map(s => s.name).join(", ")}</span> in our records. 
                A <span className="font-bold text-brand-600">10% discount</span> is applied to your qualifying payments.
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="text-red-500 font-bold">Not Eligible:</span> No linked siblings found. 
                Students with registered siblings receive a 10% discount; otherwise, the <span className="font-bold">full fare</span> applies.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400 mt-1">${totalPending.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">You've Saved</p>
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
                  {["#", "Course", "Original", "Discount", "Final", "Status", "Date", "Action"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">#{p.id}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{getCourseName(p.enrollment_id)}</td>
                    <td className="px-5 py-3 text-gray-500">${p.amount}</td>
                    <td className="px-5 py-3 text-brand-500 text-xs">{p.discount_applied ?? "—"}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white">${p.final_amount.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{p.payment_date ?? "—"}</td>
                    <td className="px-5 py-3 text-right">
                      {p.status !== "paid" ? (
                        <button
                          onClick={() => handlePay(p)}
                          className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Paid</span>
                      )}
                    </td>
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
