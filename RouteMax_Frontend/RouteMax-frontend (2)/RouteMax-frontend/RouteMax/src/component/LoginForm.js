// src/components/LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegistrationForm.css";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        const { token, message: successMsg } = response.data;
        console.log("✅ JWT Token:", token);

        // ✅ Save token
        localStorage.setItem("token", token);

        // ✅ Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userData = {
          name: payload.sub,
          email: payload.email,
          role: payload.role,
        };
        localStorage.setItem("user", JSON.stringify(userData));

        setMessage(`✅ ${successMsg}`);
        setFormData({ email: "", password: "" });

        // ✅ Navigate to user dashboard
        navigate("/user/dashboard");
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="form-panel">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="sign-up-btn">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default LoginForm;
