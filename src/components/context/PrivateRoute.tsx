import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, booted } = useAuth();
  if (!booted) return null;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}
