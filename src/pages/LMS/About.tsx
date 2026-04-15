import PageMeta from "../../components/common/PageMeta";
import { teachers } from "../../data/dummy";

export default function AboutPage() {
  return (
    <>
      <PageMeta title="About Us | LMS" description="Learn about Mathsmastery Institute" />

      {/* Hero */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-500 to-brand-600 p-10 text-white">
        <h1 className="text-3xl font-bold">About Mathsmastery Institute</h1>
        <p className="mt-3 max-w-2xl text-purple-100 leading-relaxed">
          We are a dedicated learning centre committed to helping students reach their full academic potential through
          personalised, high-quality education in a supportive environment.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Our Mission", icon: "🎯", text: "To provide accessible, high-quality tutoring that empowers every student to achieve their academic goals." },
          { title: "Our Vision", icon: "🔭", text: "A world where every student has access to the guidance and support they need to succeed." },
          { title: "Our Values", icon: "💡", text: "Excellence, integrity, inclusivity, and a genuine passion for education drive everything we do." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Years of Experience", value: "10+" },
          { label: "Courses Offered", value: "6" },
          { label: "Qualified Teachers", value: "5" },
          { label: "Students Graduated", value: "500+" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center">
            <p className="text-3xl font-bold text-brand-500">{s.value}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Meet the Team */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Meet Our Teachers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-brand-500">{t.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">{t.qualifications}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.availability.days.map((d) => (
                  <span key={d} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
