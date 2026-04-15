import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import Register from "./pages/AuthPages/Register";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import LMSHome from "./pages/LMS/Home";
import CoursesPage from "./pages/LMS/Courses";
import CourseDetails from "./pages/LMS/CourseDetails";
import CreateUser from "./pages/LMS/CreateUserPage";
import EditCourse from "./pages/LMS/EditCourse";
import AboutPage from "./pages/LMS/About";
import ContactPage from "./pages/LMS/Contact";
import SchedulePage from "./pages/LMS/Schedule";
import PaymentsPage from "./pages/LMS/Payments";
import ManagementPage from "./pages/LMS/admin/Management";
import AnalyticsPage from "./pages/LMS/admin/Analytics";
import TeacherDashboard from "./pages/LMS/teacher/TeacherDashboard";
import AddCoursePage from "./pages/LMS/AddCoursePage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Layout Wrapper */}
        <Route element={<AppLayout />}>

          {/* PUBLIC (any logged-in user) */}
          <Route path="/" element={<LMSHome />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* STUDENT + TEACHER + ADMIN (logged in only) */}
          <Route
            path="/courses/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <AddCoursePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["admin", "student", "teacher"]}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ONLY */}
          <Route
            path="/createUser"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/management"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* TEACHER ONLY */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* AUTH */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
