import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaUserPlus, FaUsers, FaTruck, FaUserCircle, FaCaretDown, FaCommentDots } from "react-icons/fa";

function AdminDashboard() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'Admin',
    email: 'admin@routemax.com',
    role: 'ADMIN',
  });
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // In a real app, you would fetch the logged-in user data here
    const loggedInUser = {
      username: "Admin",
      email: "admin@routemax.com",
      role: "ADMIN",
    };
    setCurrentUser(loggedInUser);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header and Profile */}
      <nav className="header-nav">
        <Link to="/" className="logo">RouteGenius</Link>
        <div className="admin-profile-dropdown">
          <div className="profile-toggle" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <FaUserCircle className="profile-icon" />
            <span>{currentUser.username}</span>
            <FaCaretDown className={`dropdown-caret ${showProfileDropdown ? 'rotate' : ''}`} />
          </div>
          {showProfileDropdown && (
            <div className="profile-dropdown-content">
              <p><strong>Username:</strong> {currentUser.username}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Password:</strong> ••••••••</p>
              {/* Added a logout button */}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="content-area">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome, {currentUser.username} 👋</h1>
          <p className="welcome-subtitle">
            Manage your parcels, users, and stay updated.
          </p>
        </div>

        {/* Cards Section with Link components */}
        <div className="card-container">
          <Link to="/add-user" className="card">
            <h3 className="card-title">
              <FaUserPlus className="card-icon" /> Add User
            </h3>
            <p className="card-text">
              Create new user accounts for the system.
            </p>
            <span className="card-link">Add New User →</span>
          </Link>

          <Link to="/view-users" className="card">
            <h3 className="card-title">
              <FaUsers className="card-icon" /> View Users
            </h3>
            <p className="card-text">
              Search, edit, and delete existing user accounts.
            </p>
            <span className="card-link">Manage Users →</span>
          </Link>

          <Link to="/parcels" className="card">
            <h3 className="card-title">
              <FaTruck className="card-icon" /> Manage Parcels
            </h3>
            <p className="card-text">
              Oversee and update all parcel delivery statuses.
            </p>
            <span className="card-link">Go to Parcels →</span>
          </Link>
          
          {/* This card is now a Link component */}
          <Link to="/feedback" className="card">
            <h3 className="card-title">
              <FaCommentDots className="card-icon" /> View Feedback
            </h3>
            <p className="card-text">
              See what users are saying about their deliveries.
            </p>
            <span className="card-link">View Feedback →</span>
          </Link>
        </div>
        
        {/* The feedback section has been removed from this page. */}
      </div>
    </div>
  );
}

export default AdminDashboard;
