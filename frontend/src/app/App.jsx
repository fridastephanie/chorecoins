import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../features/landing/Landing";
import Login from "../features/auth/login/Login";
import Register from "../features/auth/register/Register";
import Dashboard from "../features/dashboard/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
