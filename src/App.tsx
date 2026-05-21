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
import PaymentSuccessPage from "./pages/LMS/PaymentSuccess";
import PaymentFailurePage from "./pages/LMS/PaymentFailure";
import ManagementPage from "./pages/LMS/admin/Management";
import AnalyticsPage from "./pages/LMS/admin/Analytics";
import TeacherDashboard from "./pages/LMS/teacher/TeacherDashboard";
import EnrolledStudentsPage from "./pages/LMS/teacher/EnrolledStudentsPage";
import TeacherSchedulePage from "./pages/LMS/teacher/TeacherSchedulePage";
import AddCoursePage from "./pages/LMS/AddCoursePage";
import MyCoursesPage from "./pages/LMS/student/MyCourses";
import StudentEnrollmentsPage from "./pages/LMS/student/StudentEnrollments";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageUsersPage from "./pages/LMS/admin/ManageUsers";
import EditUserPage from "./pages/LMS/admin/EditUser";
import TeachersPage from "./pages/LMS/admin/Teachers";
import StudentsPage from "./pages/LMS/admin/Students";
import AssignCoursesPage from "./pages/LMS/admin/AssignCourses";
import AssignUnitsPage from "./pages/LMS/admin/AssignUnits";
import EnrollmentsPage from "./pages/LMS/admin/Enrollments";
import Siblings from "./pages/LMS/admin/Siblings";
import PaymentDetailsPage from "./pages/LMS/admin/PaymentDetails";
import MyUnits from "./pages/LMS/student/MyUnitsPage";
import FinalGrades from "./pages/LMS/student/FinalGrades";
import UnitDetailsPage from "./pages/LMS/student/UnitDetailsPage";
import TeacherUnitsPage from  "./pages/LMS/teacher/TeacherUnitsPage";
import TeacherSubmissionsCoursesPage from "./pages/LMS/teacher/submissions/TeacherSubmissionsCoursesPage";
import TeacherSubmissionsUnitsPage from "./pages/LMS/teacher/submissions/TeacherSubmissionsUnitsPage";
import TeacherSubmissionsAssessmentsPage from "./pages/LMS/teacher/submissions/TeacherSubmissionsAssessmentsPage";
import TeacherSubmissionsListPage from "./pages/LMS/teacher/submissions/TeacherSubmissionsListPage";
import UnitFinalGrades from "./pages/LMS/teacher/submissions/UnitFinalGrades";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TeacherDashboardHome from "./pages/Dashboard/TeacherDashboardHome";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";


export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route element={<AppLayout />}>

          <Route path="/" element={<LMSHome />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route
            path="/student/my-courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/enrollments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentEnrollmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <AddCoursePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeachersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EnrollmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers/assign"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AssignCoursesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers/assignUnits"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AssignUnitsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EditUserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finalGrades"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <FinalGrades />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-failure"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PaymentFailurePage />
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

          <Route
            path="/createUser"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsersPage />
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

          <Route
            path="/admin/siblings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Siblings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PaymentDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/enrolled-students"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <EnrolledStudentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/schedule"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherSchedulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/enrollments/myUnits/:courseId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyUnits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/units/:unitId"
            element={<UnitDetailsPage />}
          />
          <Route
            path="/teacher/courses/:courseId/units"
            element={<TeacherUnitsPage />}
/>
{/* SUBMISSIONS FLOW */}
<Route
  path="/teacher/submissions"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherSubmissionsCoursesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/submissions/:courseId/units"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherSubmissionsUnitsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/submissions/:courseId/units/:unitId/assessments"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherSubmissionsAssessmentsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/submissions/:courseId/units/:unitId/assessments/:assessmentId/submissions"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherSubmissionsListPage />
    </ProtectedRoute>
  }
/>
  <Route
    path="/teacher/submissions/:courseId/units/:unitId/final-grades"
    element={
      <ProtectedRoute allowedRoles={["teacher"]}>
        <UnitFinalGrades />
      </ProtectedRoute>
    }
  />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/teacher" element={<TeacherDashboardHome />} />
<Route path="/student" element={<StudentDashboard />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
