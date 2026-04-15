import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageMeta title="Contact Us | LMS" description="Get in touch with Mathsmastery Institute" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">We'd love to hear from you. Send us a message and we'll respond promptly.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Contact Form */}
        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-4 text-sm text-brand-500 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Smith"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@mathsmasterylms.com.au"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500"
                  >
                    <option value="">Select a subject</option>
                    <option>Course Enquiry</option>
                    <option>Enrolment</option>
                    <option>Payment</option>
                    <option>Technical Issue</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-brand-500 resize-none"
                  />
                </div>
                <button type="submit" className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {[
            { icon: "📍", label: "Address", value: "123 Learning Lane, Melbourne VIC 3000, Australia" },
            { icon: "📞", label: "Phone", value: "+61 3 9123 4567" },
            { icon: "✉️", label: "Email", value: "hello@mathsmasterylms.com.au" },
            { icon: "🕐", label: "Office Hours", value: "Mon–Fri: 8am–6pm\nSat: 9am–1pm" },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Follow Us</h3>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Twitter", "LinkedIn"].map((s) => (
                <span key={s} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
