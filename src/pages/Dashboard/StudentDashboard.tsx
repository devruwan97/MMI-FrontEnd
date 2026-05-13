import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

interface Material {
  id: number;
  title: string;
  url: string;
}

interface Unit {
  id: number;
  unitCode: string;
  unitName: string;
  description: string;
  termId: number;
  termName: string;
  termStartDate: string;
  termEndDate: string;
  materials: Material[];
}

export default function StudentDashboard() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/units", {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();
        setUnits(data.units || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  // ================= CURRENT SEMESTER FILTER =================
  const isCurrentTerm = (start: string, end: string) => {
    const now = new Date().getTime();
    return (
      now >= new Date(start).getTime() &&
      now <= new Date(end).getTime()
    );
  };

  const currentUnits = units.filter((u) =>
    isCurrentTerm(u.termStartDate, u.termEndDate)
  );

  const upcomingUnits = units.filter(
    (u) => new Date(u.termStartDate).getTime() > new Date().getTime()
  );

  const completedUnits = units.filter(
    (u) => new Date(u.termEndDate).getTime() < new Date().getTime()
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <>
      <PageMeta
        title="Student Dashboard"
        description="Student learning portal"
      />

      <div className="p-6 space-y-6">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold">Welcome Back 🎓</h1>
          <p className="text-sm opacity-80">
            Track your learning progress & current semester units
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="p-5 bg-white rounded-xl shadow border">
            <h3 className="text-gray-500 text-sm">Current Semester Units</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {currentUnits.length}
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl shadow border">
            <h3 className="text-gray-500 text-sm">Upcoming Units</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {upcomingUnits.length}
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl shadow border">
            <h3 className="text-gray-500 text-sm">Completed Units</h3>
            <p className="text-2xl font-bold text-green-600">
              {completedUnits.length}
            </p>
          </div>
        </div>

        {/* ================= CURRENT SEMESTER ================= */}
        <div className="bg-white rounded-2xl shadow p-5 border">
          <h2 className="text-lg font-semibold mb-4">
            📚 Current Semester Units
          </h2>

          {currentUnits.length === 0 ? (
            <p className="text-gray-500">No active semester units</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="border rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="text-xs text-gray-500">
                    {unit.unitCode}
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    {unit.unitName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  <div className="mt-3 text-xs text-indigo-600 font-medium">
                    {unit.termName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= SIMPLE CALENDAR VIEW ================= */}
        <div className="bg-white rounded-2xl shadow p-5 border">
          <h2 className="text-lg font-semibold mb-4">📅 Semester Timeline</h2>

          <div className="space-y-3">
            {currentUnits.slice(0, 5).map((unit) => (
              <div
                key={unit.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{unit.unitName}</p>
                  <p className="text-xs text-gray-500">{unit.unitCode}</p>
                </div>

                <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SIMPLE CHART UI ================= */}
        <div className="bg-white rounded-2xl shadow p-5 border">
          <h2 className="text-lg font-semibold mb-4">📊 Progress Overview</h2>

          <div className="space-y-3">

            <div>
              <p className="text-sm">Completed</p>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${
                      (completedUnits.length / (units.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm">Current</p>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-indigo-500 h-3 rounded-full"
                  style={{
                    width: `${
                      (currentUnits.length / (units.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm">Upcoming</p>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{
                    width: `${
                      (upcomingUnits.length / (units.length || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}