import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚑 Redirect doctor from dashboard
  if (user.role === "DOCTOR" && location.pathname === "/") {
    return <Navigate to={`/doctors/${user.id}`} replace />;
  }

  if (user.role === "STAFF" && location.pathname === "/") {
    return <Navigate to={`/appointments`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
