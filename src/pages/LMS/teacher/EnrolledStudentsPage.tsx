import { useState, useMemo, useEffect } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { getAuthHeaders } from "../../../api/Api";

// Simulating logged-in teacher #1 (Dr. Sarah Mitchell)
const TEACHER_ID = 1;

export default function EnrolledStudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeaders();
        const [cRes, eRes, sRes] = await Promise.all([
          fetch("http://localhost:8080/api/courses", { headers }),
          fetch("http://localhost:8080/api/enrollments", { headers }),
          fetch("http://localhost:8080/api/students", { headers }),
        ]);

        if (cRes.ok) setCourses(await cRes.json());
        if (eRes.ok) setEnrollments(await eRes.json());
        if (sRes.ok) setStudents(await sRes.json());
      } catch (err) {
        console.error("Error loading enrolled students data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get data specifically for this teacher
  const myCourses = useMemo(() => 
    courses.filter((c) => c.created_by === TEACHER_ID || c.createdBy?.id === TEACHER_ID), 
    [courses]
  );
  const myCourseIds = useMemo(() => myCourses.map((c) => c.id), [myCourses]);
  
  // Filter enrollments to only those in this teacher's courses
  const teacherEnrollments = useMemo(() => 
    enrollments.filter((e) => myCourseIds.includes(e.course_id)), 
    [myCourseIds, enrollments]
  );

  // Map students with their enrollment info for this teacher's courses
  const enrolledStudents = useMemo(() => {
    return teacherEnrollments.map((enr) => {
      const studentData = students.find((s) => s.id === enr.student_id);
      const course = courses.find((c) => c.id === enr.course_id);
      return {
        ...studentData,
        name: studentData?.name || studentData?.user?.name || "Unknown Student",
        email: studentData?.email || studentData?.user?.email || "",
        enrollmentId: enr.id,
        courseTitle: course?.title || "Unknown Course",
        courseId: enr.course_id,
        status: enr.status,
        enrolledAt: enr.enrolled_at,
      };
    });
  }, [teacherEnrollments, students, courses]);

  // Final filtered list based on UI inputs
  const filteredStudents = enrolledStudents.filter((s) => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = selectedCourse === "All" || s.courseId === Number(selectedCourse);
    return matchesSearch && matchesCourse;
  });

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-medium">Loading enrollment records...</div>;
  }

  return (
    <>
      <PageMeta title="Enrolled Students | Teacher" description="View students enrolled in your courses" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Enrolled Students</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and view participation for all students in your assigned courses
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="All">All Courses</option>
          {myCourses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Enrollments</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{enrolledStudents.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {enrolledStudents.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">New This Term</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {enrolledStudents.filter(s => s.enrolledAt?.startsWith('2026')).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Course</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Enrolled Date</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">No students found matching your criteria.</td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={`${s.id}-${s.enrollmentId}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center font-bold border border-teal-100 dark:border-teal-800">
                          {s.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">{s.name}</div>
                          <div className="text-[10px] text-gray-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">{s.courseTitle}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyles[s.status || '']}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{s.enrolledAt}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-brand-500 hover:underline font-semibold text-xs">View Performance</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}