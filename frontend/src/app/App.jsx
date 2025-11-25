import { Routes, Route } from "react-router-dom";

import Landing from "../features/landing/Landing";
import Register from "../features/auth/register/Register";
import Login from "../features/auth/login/Login";
import Dashboard from "../features/dashboard/Dashboard";
import EditUser from "../features/editUser/EditUser";
import LoggedInLayout from "../shared/components/Layout/LoggedInLayout";
import ProtectedRoute from "../shared/routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <LoggedInLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
      </Route>
    </Routes>
  );
}