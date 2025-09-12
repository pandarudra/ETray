import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { Manager } from "./pages/Manager";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <Manager />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </HashRouter>
  );
};
