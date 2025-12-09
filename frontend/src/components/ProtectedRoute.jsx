import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

/**
 * @typedef ProtectedRouteProps
 * @property {React.ReactNode} children
 * @property {boolean} [requireAdmin]
 */

/**
 * @param {ProtectedRouteProps} props
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
