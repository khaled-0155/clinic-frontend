// src/components/auth/RoleGuard.jsx

// src/components/auth/RoleGuard.jsx
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function RoleGuard({ allow = [], children, fallback = null }) {
  const { user, loading } = useContext(AuthContext);

  // Wait until auth loads
  if (loading) return null;

  // Not logged in
  if (!user) return fallback;

  // Normalize roles
  const roles = Array.isArray(allow) ? allow : [allow];

  // If no roles specified allow access
  if (roles.length === 0) return children;

  // Check permission
  if (!roles.includes(user.role)) {
    return fallback;
  }

  return children;
}

/**
<RoleGuard allow="Admin">
  <DeleteUserButton />
</RoleGuard>

<RoleGuard allow={["Admin", "Doctor"]}>
  <PatientHistory />
</RoleGuard>
 */
