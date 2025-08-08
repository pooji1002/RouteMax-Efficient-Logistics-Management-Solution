import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Logging in...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { token } = response.data;
        const payload = JSON.parse(atob(token.split(".")[1]));

        // ✅ CORRECTED: Check for "ROLE_ADMIN" instead of "ADMIN"
        if (payload.role === "ROLE_ADMIN") {
          localStorage.setItem("token", token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: payload.sub,
              email: payload.email,
              role: payload.role,
            })
          );
          setMessage("✅ Admin login successful!");
          navigate("/admin/dashboard");
        } else {
          setMessage("❌ You are not authorized as admin.");
        }
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error.response?.data || error);
      setMessage("❌ Login failed. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="admin-login-section">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="admin-login-section">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
        {message && (
          <p style={{ marginTop: "10px", color: "red", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
