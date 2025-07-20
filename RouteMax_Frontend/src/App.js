import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import AuthPage from "./component/AuthPage";
import UserDashboard from "./component/UserDashboard";
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/AdminDashboard";

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

// 👉 separate layout so we can use hooks
function Layout() {
  const location = useLocation();

  // Check if current path is a dashboard
  const hideTabs =
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/admin/dashboard");

  return (
    <div>
      {/* ✅ Show top-tabs only if NOT in dashboards */}
      {!hideTabs && (
        <div className="top-tabs">
          <Link to="/user">User</Link>
          <Link to="/admin">Admin</Link>
        </div>
      )}

      <Routes>
        <Route path="/user" element={<AuthPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;