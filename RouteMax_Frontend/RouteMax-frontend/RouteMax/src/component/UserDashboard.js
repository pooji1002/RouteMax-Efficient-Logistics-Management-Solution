import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
// import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();  // for redirection

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="logo">RouteMax</div>
        <div className="profile-icon-container" onClick={toggleDropdown}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
            alt="Profile"
            className="profile-icon"
          />
          {showDropdown && (
            <div className="dropdown">
              <div className="dropdown-info">
                <strong>{user?.name}</strong>
                <p>{user?.email}</p>
              </div>
              <hr />
              <button className="dropdown-btn" onClick={handleEditProfile}>Edit Profile</button>
              {/* <Link to="/edit-profile" className="dropdown-btn">Edit Profile</Link> */}
              <button className="dropdown-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="content">
        <div className="hero">
          <h2>Welcome, {user?.name} 👋</h2>
          <p>Manage your deliveries, track parcels, and stay updated.</p>
          <Link to="/track" className="track-link">📦 Track Parcel</Link>
        </div>

        <div className="cards">
          <div className="card">
            <h3>📦 Track Parcel</h3>
            <p>Enter your tracking ID to view your delivery status and updates.</p>
            <Link to="/track">Track Details →</Link>
          </div>

          <div className="card">
            <h3>🧾 Parcel History</h3>
            <p>Check your previous orders and delivery statuses.</p>
            <Link to="#">View History →</Link>
          </div>

          <div className="card">
            <h3>📬 Help & Support</h3>
            <p>Need help? Reach out to our support team easily.</p>
            <Link to="/support">Contact Support →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
