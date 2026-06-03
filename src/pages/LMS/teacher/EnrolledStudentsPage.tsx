import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { API_BASE_URL } from "../../../api/Api";

interface Course {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface EnrolledStudent extends Student {
  courseId: number;
  courseTitle: string;
}

export default function TeacherEnrolledStudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | "All">("All");

  const [courses, setCourses] = useState<Course[]>([]);
  const [studentsByCourse, setStudentsByCourse] = useState<Record<number, Student[]>>({});

  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ======================
  // FETCH COURSES
  // ======================
  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/teachers/${teacherId}/schedule/courses`,
          { headers }
        );

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Course error:", err);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // ======================
  // FETCH STUDENTS
  // ======================
  useEffect(() => {
    const fetchStudents = async () => {
      if (courses.length === 0) return;

      try {
        const result: Record<number, Student[]> = {};

        await Promise.all(
          courses.map(async (course) => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/api/students/course/${course.id}`,
                { headers }
              );

              result[course.id] = res.ok ? await res.json() : [];
            } catch {
              result[course.id] = [];
            }
          })
        );

        setStudentsByCourse(result);
      } catch (err) {
        console.error("Student error:", err);
      }
    };

    fetchStudents();
  }, [courses]);

  // ======================
  // FLATTEN DATA
  // ======================
  const students: EnrolledStudent[] = useMemo(() => {
    const list: EnrolledStudent[] = [];

    courses.forEach((course) => {
      const courseStudents = studentsByCourse[course.id] || [];

      courseStudents.forEach((s) => {
        list.push({
          ...s,
          courseId: course.id,
          courseTitle: course.title,
        });
      });
    });

    return list;
  }, [courses, studentsByCourse]);

  // ======================
  // FILTER
  // ======================
  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchCourse =
      selectedCourse === "All" || s.courseId === selectedCourse;

    return matchSearch && matchCourse;
  });

  return (
    <>
      <PageMeta
        title="Enrolled Students"
        description="Teacher students view"
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Enrolled Students</h1>
        <p className="text-gray-500">
          Students in your courses
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex gap-3">
        <input
          className="flex-1 border rounded-xl px-4 py-2"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-xl px-4 py-2"
          value={selectedCourse}
          onChange={(e) =>
            setSelectedCourse(
              e.target.value === "All" ? "All" : Number(e.target.value)
            )
          }
        >
          <option value="All">All Courses</option>

          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No students found</p>
        ) : (
          filtered.map((s) => (
            <div
              key={`${s.id}-${s.courseId}`}
              className="border rounded-2xl p-5 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                  {s.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {s.courseTitle}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}