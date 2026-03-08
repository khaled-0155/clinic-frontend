import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";

import MainLayout from "../layouts/MainLayout";
import Appointments from "../pages/Appointments";
import AcceptInvite from "../pages/auth/AcceptInvite";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import Branches from "../pages/Branches";
import Dashboard from "../pages/Dashboard";
import DoctorDetails from "../pages/DoctorDetails";
import Doctors from "../pages/Doctors";
import Packages from "../pages/Packages";
import PatientDetails from "../pages/PatientDetails";
import Patients from "../pages/Patients";
import Staff from "../pages/Staff";
import Transactions from "../pages/Transactions";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/accept-invite/:token"
        element={
          <PublicRoute>
            <AcceptInvite />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTE */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path=""
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="doctors/:id"
          element={
            <ProtectedRoute>
              <DoctorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Staff />
            </ProtectedRoute>
          }
        />

        <Route
          path="branches"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Branches />
            </ProtectedRoute>
          }
        />

        <Route
          path="transactions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route path="appointments" element={<Appointments />} />
        <Route path="packages" element={<Packages />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetails />} />

        {/* <Route index element={<Dashboard />} />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        /> */}
      </Route>
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
    </Routes>
  );
};

export default AppRoutes;
