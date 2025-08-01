import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import AuthPage from "./component/AuthPage";
import UserDashboard from "./component/UserDashboard";
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/AdminDashboard";
import ParcelList from "./component/ParcelList";
import ParcelForm from "./component/ParcelForm";
import TrackParcel from "./component/TrackParcel";
import ContactSupport from "./component/ContactSupport"; // adjust path if needed
import HomePage from "./component/HomePage";

// 👉 Corrected imports to match your file names
import AddUser from "./component/AddUser";
import ViewUserPage from "./component/ViewUserPage";

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* 👉 New routes for user management pages */}
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/view-users" element={<ViewUserPage />} />

        {/* 👉 Existing parcel and other routes */}
        <Route path="/parcels" element={<ParcelList />} />
        <Route path="/parcels/new" element={<ParcelForm />} />
        <Route path="/parcels/edit/:id" element={<ParcelForm />} />
        <Route path="/track" element={<TrackParcel />} />
        <Route path="/support" element={<ContactSupport />} />
        {/* <Route path="/edit-profile" element={<EditProfile />} /> */}
      </Routes>
    </div>
  );
}

export default App;