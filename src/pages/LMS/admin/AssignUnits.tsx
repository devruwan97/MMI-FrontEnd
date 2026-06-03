import { useState, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../api/Api";

interface Teacher {
  id: string | number;
  name: string;
}

interface Course {
  id: string | number;
  title: string;
}

interface Unit {
  id: string | number;
  unitName: string;
  unitCode?: string;
  description?: string;
}

export default function AssignUnitsPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // LOAD TEACHERS
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/teachers`, {
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => setTeachers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // LOAD COURSES
  useEffect(() => {
    if (!selectedTeacher) {
      setCourses([]);
      setUnits([]);
      setSelectedCourse("");
      setSelectedUnits([]);
      return;
    }

    fetch(
      `${API_BASE_URL}/api/courses/teacher/${selectedTeacher}/courses`,
      { headers: authHeaders }
    )
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setSelectedCourse("");
        setUnits([]);
        setSelectedUnits([]);
      })
      .catch((err) => console.error(err));
  }, [selectedTeacher]);

  // LOAD UNITS (FIXED RESPONSE HANDLING)
  useEffect(() => {
    if (!selectedCourse) {
      setUnits([]);
      setSelectedUnits([]);
      return;
    }

    fetch(`${API_BASE_URL}/api/courses/${selectedCourse}/units`, {
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        const unitList = data?.units ?? [];
        setUnits(Array.isArray(unitList) ? unitList : []);
        setSelectedUnits([]);
      })
      .catch((err) => console.error(err));
  }, [selectedCourse]);

  // CHECKBOX HANDLER
  const handleUnitToggle = (unitId: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedTeacher || !selectedCourse || selectedUnits.length === 0)
    return;

  setIsSubmitting(true);
  setMessage(null);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/teachers/units/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          courseId: selectedCourse,
          unitIds: selectedUnits,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to assign units");

    setMessage({
      type: "success",
      text: "Units assigned successfully!",
    });

    setSelectedUnits([]);
  } catch (err) {
    setMessage({
      type: "error",
      text:
        err instanceof Error ? err.message : "Unexpected error",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading list data...</div>;
  }

  return (
    <>
      <PageMeta
        title="Assign Units | Admin"
        description="Assign units to teachers"
      />

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Assign Units
          </h1>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20"
                  : "bg-red-50 text-red-700 dark:bg-red-900/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TEACHER */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Choose a teacher...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* COURSE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Course
              </label>
              <select
                disabled={!selectedTeacher}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Choose a course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* UNITS (CHECKBOX FIX) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Units
              </label>

              <div className="border rounded-xl p-3 max-h-[260px] overflow-y-auto">
                {units.length === 0 ? (
                  <p className="text-sm text-gray-500">No units available</p>
                ) : (
                  units.map((unit) => (
                    <label
                      key={unit.id}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnits.includes(String(unit.id))}
                        onChange={() =>
                          handleUnitToggle(String(unit.id))
                        }
                      />
                      <span className="text-sm">
                        {unit.unitCode} - {unit.unitName}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || selectedUnits.length === 0}
              className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold"
            >
              {isSubmitting ? "Assigning..." : "Assign Units"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}