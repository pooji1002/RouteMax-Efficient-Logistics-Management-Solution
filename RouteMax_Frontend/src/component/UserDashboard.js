// src/components/UserDashboard.js
import React from "react";
import "./Dashboard.css";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user")); // stored in login

  return (
    <div className="dashboard">
      <div className="header">
        <div className="logo">RouteMax</div>
        <div className="profile">
          {user?.name} | {user?.email}
        </div>
      </div>
      <div className="content">
        <h2>Welcome, {user?.name}!</h2>
        <p>This is your user dashboard.</p>
      </div>
    </div>
  );
}

export default UserDashboard;
