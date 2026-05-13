import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";

type Tab = "courses";

interface Teacher {
  id: number;
  userId: number;
  name: string;
  email: string;
  bio: string;
  qualifications: string;
  role: string;
  createdAt: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  capacity: number;
  fee: number;
}

export default function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>("courses");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // =========================
        // FETCH TEACHER PROFILE
        // =========================
        const teacherRes = await fetch(
          `http://localhost:8080/api/teachers/${teacherId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!teacherRes.ok) {
          throw new Error("Failed to fetch teacher profile");
        }

        const teacherData = await teacherRes.json();

        const mappedTeacher: Teacher = {
          id: teacherData.id,
          userId: teacherData.userId,
          name: teacherData.name,
          email: teacherData.email,
          bio: teacherData.bio,
          qualifications: teacherData.qualifications,
          role: teacherData.role,
          createdAt: teacherData.createdAt,
        };

        setTeacher(mappedTeacher);

        // =========================
        // FETCH COURSES
        // =========================
        const courseRes = await fetch(
          `http://localhost:8080/api/teachers/${teacherId}/schedule/courses`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!courseRes.ok) {
          throw new Error("Failed to fetch teacher courses");
        }

        const courseData = await courseRes.json();

        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchData();
    }
  }, [teacherId, token]);

  // ========================= LOADING =========================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading teacher dashboard...
      </div>
    );
  }

  // ========================= ERROR =========================
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Teacher Dashboard | LMS"
        description="Teacher portal"
      />

      {/* ================= HEADER ================= */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <p className="text-green-100 text-sm">
          Welcome back,
        </p>

        <h1 className="text-2xl font-bold mt-0.5">
          {teacher?.name}
        </h1>

        <p className="text-sm text-green-100 mt-1">
          {teacher?.email}
        </p>

        <div className="mt-3 flex gap-4 text-sm flex-wrap">
          <span className="bg-white/20 rounded-lg px-3 py-1">
            {courses.length} Courses
          </span>

          <span className="bg-white/20 rounded-lg px-3 py-1">
            {teacher?.qualifications}
          </span>

          <span className="bg-white/20 rounded-lg px-3 py-1">
            Teacher Portal
          </span>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setTab("courses")}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
            tab === "courses"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Courses ({courses.length})
        </button>
      </div>

      {/* ================= COURSES GRID ================= */}
      {tab === "courses" && (
        <>
          {courses.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No courses assigned yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/teacher/courses/${course.id}/units`}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
                >
                  {/* COURSE IMAGE */}
                  <img
                    src="https://info.ehl.edu/hubfs/Blog-EHL-Insights/Blog-Header-EHL-Insights/e_learning_course.jpg"
                    alt={course.title}
                    className="h-36 w-full object-cover"
                  />

                  {/* COURSE CONTENT */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>

                    <h3 className="mt-3 font-semibold text-gray-800 dark:text-white">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Capacity: {course.capacity}
                      </span>

                      <span className="text-brand-500 font-semibold">
                        ${course.fee}
                      </span>
                    </div>

                    <div className="mt-4 text-sm font-semibold text-brand-500">
                      Open Units →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}