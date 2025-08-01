// component/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // create this for styling

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>📦 Welcome to RouteMax</h1>
        <p>Fast. Reliable. Secure Parcel Tracking Solution.</p>
        <div className="home-buttons">
          <Link to="/user" className="home-btn">User Login</Link>
          <Link to="/admin" className="home-btn">Admin Panel</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
