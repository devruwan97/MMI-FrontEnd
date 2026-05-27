import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from "recharts";

interface Course {
    id: number;
    title: string;
    category: string;
    fee: number;
    capacity: number;
}

interface Enrollment {
    id: number;
    enrolledAt: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function CourseAnalytics() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(false);

    // ================= LOAD COURSES =================
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetch("http://localhost:8080/api/courses");
            const data = await res.json();
            setCourses(data);
        };

        fetchCourses();
    }, []);

    // default select first course
    useEffect(() => {
        if (courses.length && selectedCourse === null) {
            setSelectedCourse(courses[0].id);
        }
    }, [courses]);

    // ================= LOAD ENROLLMENTS =================
    useEffect(() => {
        if (!selectedCourse) return;

        const fetchEnrollments = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `http://localhost:8080/api/enrollments/course/${selectedCourse}`
                );

                const data = await res.json();
                setEnrollments(data);
            } catch (err) {
                console.error(err);
                setEnrollments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [selectedCourse]);

    const selectedCourseData = useMemo(
        () => courses.find((c) => c.id === selectedCourse),
        [courses, selectedCourse]
    );

    // ================= METRICS =================
    const totalStudents = enrollments.length;
    const capacity = selectedCourseData?.capacity || 0;
    const remaining = capacity - totalStudents;
    const utilization = capacity ? Math.round((totalStudents / capacity) * 100) : 0;

    // ================= PIE DATA =================
    const pieData = [
        { name: "Enrolled", value: totalStudents },
        { name: "Remaining", value: Math.max(remaining, 0) },
    ];

    // ================= MONTHLY TREND =================
    const monthlyData = useMemo(() => {
        const map: Record<string, number> = {};

        enrollments.forEach((e) => {
            const month = new Date(e.enrolledAt).toLocaleString("default", {
                month: "short",
            });
            map[month] = (map[month] || 0) + 1;
        });

        return Object.keys(map).map((m) => ({
            month: m,
            students: map[m],
        }));
    }, [enrollments]);

    return (
        <>
            <PageMeta title="Course Analytics" description="Management analytics dashboard" />

            <div className="min-h-screen bg-gray-50 p-6 space-y-6">

                {/* ================= HEADER ================= */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold">📊 Course Analytics Dashboard</h1>
                    <p className="text-sm opacity-80 mt-1">
                        Monitor enrollment, capacity and course performance
                    </p>
                </div>

                {/* ================= LAYOUT ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* LEFT COURSE PANEL */}
                    {/* LEFT COURSE PANEL */}
                    <div className="bg-white p-5 rounded-2xl shadow border lg:col-span-1 h-fit">
                        <h2 className="font-semibold mb-4 text-gray-800">
                            Courses
                        </h2>

                        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                            {courses.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedCourse(c.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${selectedCourse === c.id
                                            ? "bg-blue-50 border-blue-400 shadow-sm"
                                            : "hover:bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <div className="font-semibold text-sm text-gray-800 line-clamp-1">
                                        {c.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {c.category}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MAIN PANEL */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* ================= SUMMARY CARDS ================= */}
                        {selectedCourseData && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                <div className="bg-white p-4 rounded-2xl shadow border">
                                    <p className="text-xs text-gray-500">Enrolled</p>
                                    <h2 className="text-2xl font-bold text-blue-600">{totalStudents}</h2>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow border">
                                    <p className="text-xs text-gray-500">Capacity</p>
                                    <h2 className="text-2xl font-bold text-gray-800">{capacity}</h2>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow border">
                                    <p className="text-xs text-gray-500">Remaining</p>
                                    <h2 className="text-2xl font-bold text-green-600">{remaining}</h2>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow border">
                                    <p className="text-xs text-gray-500">Utilization</p>
                                    <h2 className="text-2xl font-bold text-purple-600">{utilization}%</h2>
                                </div>

                            </div>
                        )}

                        {/* ================= CHARTS ================= */}
                        {selectedCourse && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* PIE */}
                                <div className="bg-white p-6 rounded-2xl shadow border">
                                    <h2 className="font-semibold mb-4">Capacity Breakdown</h2>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" outerRadius={110}>
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* BAR */}
                                <div className="bg-white p-6 rounded-2xl shadow border">
                                    <h2 className="font-semibold mb-4">Enrollment Stats</h2>

                                    {loading ? (
                                        <p className="text-gray-500">Loading...</p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={pieData}>
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>

                            </div>
                        )}

                        {selectedCourse && (
                            <div className="bg-white p-6 rounded-2xl shadow border">
                                <h2 className="font-semibold mb-4">Monthly Enrollment Trend</h2>

                                {monthlyData.length === 0 ? (
                                    <p className="text-gray-500">No trend data available</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={monthlyData}>
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="students" stroke="#3b82f6" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </>
    );
}