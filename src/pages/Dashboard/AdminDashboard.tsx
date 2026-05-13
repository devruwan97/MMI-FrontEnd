import PageMeta from "../../components/common/PageMeta";

export default function AdminDashboard() {
  return (
    <>
      <PageMeta title="Admin Dashboard" description="Admin control panel" />

      <div className="p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold">Admin Control Panel 🛠️</h1>
          <p className="text-sm opacity-80 mt-1">
            Manage users, courses, analytics and system configuration
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">1,248</div>
            <div className="text-xs text-gray-400 mt-2">
              Students + Teachers + Admins
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">Active Courses</div>
            <div className="text-2xl font-bold text-green-600 mt-1">32</div>
            <div className="text-xs text-gray-400 mt-2">
              Currently running programs
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border hover:shadow-lg transition">
            <div className="text-sm text-gray-500">Pending Actions</div>
            <div className="text-2xl font-bold text-orange-500 mt-1">7</div>
            <div className="text-xs text-gray-400 mt-2">
              Approvals & reviews needed
            </div>
          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button className="p-4 rounded-xl border hover:bg-blue-50 hover:border-blue-300 transition text-left">
              <div className="font-semibold text-blue-600">
                👥 Manage Users
              </div>
              <div className="text-sm text-gray-500">
                Add, edit, or remove users
              </div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-green-50 hover:border-green-300 transition text-left">
              <div className="font-semibold text-green-600">
                📚 Course Management
              </div>
              <div className="text-sm text-gray-500">
                Create and assign courses
              </div>
            </button>

            <button className="p-4 rounded-xl border hover:bg-purple-50 hover:border-purple-300 transition text-left">
              <div className="font-semibold text-purple-600">
                📊 System Analytics
              </div>
              <div className="text-sm text-gray-500">
                View platform performance
              </div>
            </button>

          </div>
        </div>

        {/* ================= SYSTEM MODULES ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">System Modules</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="p-4 bg-gray-50 rounded-xl border text-center hover:shadow">
              <div className="text-sm font-medium">Users</div>
              <div className="text-xs text-gray-500 mt-1">Management</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border text-center hover:shadow">
              <div className="text-sm font-medium">Courses</div>
              <div className="text-xs text-gray-500 mt-1">Content</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border text-center hover:shadow">
              <div className="text-sm font-medium">Payments</div>
              <div className="text-xs text-gray-500 mt-1">Finance</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border text-center hover:shadow">
              <div className="text-sm font-medium">Reports</div>
              <div className="text-xs text-gray-500 mt-1">Analytics</div>
            </div>

          </div>
        </div>

        {/* ================= ANALYTICS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">
            📈 Platform Performance
          </h2>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between text-sm">
                <span>User Growth</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-blue-500 h-3 rounded-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Course Completion</span>
                <span>72%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-green-500 h-3 rounded-full w-[72%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>System Usage</span>
                <span>91%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                <div className="bg-purple-500 h-3 rounded-full w-[91%]" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}