import PageMeta from "../../components/common/PageMeta";

export default function TeacherDashboardHome() {
  return (
    <>
      <PageMeta title="Teacher Dashboard" description="Teacher panel" />

      <div className="p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">Welcome, Teacher 👨‍🏫</h1>
          <p className="text-sm opacity-80 mt-1">
            Manage your classes, assessments and student progress
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">My Units</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">8</div>
            <div className="text-xs text-gray-400 mt-2">
              Active teaching units
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">Assessments</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">14</div>
            <div className="text-xs text-gray-400 mt-2">
              Created & scheduled
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">Pending Grades</div>
            <div className="text-2xl font-bold text-orange-500 mt-1">6</div>
            <div className="text-xs text-gray-400 mt-2">
              Need review
            </div>
          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button className="p-4 rounded-xl border hover:bg-emerald-50 hover:border-emerald-300 transition text-left">
              <div className="font-semibold text-emerald-600">
                📚 Manage Units
              </div>
              <div className="text-sm text-gray-500">
                View and edit your assigned units
              </div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-blue-50 hover:border-blue-300 transition text-left">
              <div className="font-semibold text-blue-600">
                📝 Create Assessment
              </div>
              <div className="text-sm text-gray-500">
                Add new assignments or quizzes
              </div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-orange-50 hover:border-orange-300 transition text-left">
              <div className="font-semibold text-orange-500">
                📊 Grade Submissions
              </div>
              <div className="text-sm text-gray-500">
                Review student work
              </div>
            </button>

          </div>
        </div>

        {/* ================= WEEKLY PANEL ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">
            📅 This Week Overview
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium">Maths - Year 12</p>
                <p className="text-xs text-gray-500">
                  Algebra Assessment Review
                </p>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                Due Today
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium">Physics - Unit 2</p>
                <p className="text-xs text-gray-500">
                  Lab Report Grading
                </p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                Pending
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium">Computer Science</p>
                <p className="text-xs text-gray-500">
                  Project Submissions Review
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                Completed
              </span>
            </div>

          </div>
        </div>

        {/* ================= PERFORMANCE SNAPSHOT ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">
            📈 Class Performance Snapshot
          </h2>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between text-sm">
                <span>Student Pass Rate</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-emerald-500 h-3 rounded-full w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Assignments Completed</span>
                <span>64%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-blue-500 h-3 rounded-full w-[64%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Average Engagement</span>
                <span>82%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-purple-500 h-3 rounded-full w-[82%]" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}