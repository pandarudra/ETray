import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to the auth page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
