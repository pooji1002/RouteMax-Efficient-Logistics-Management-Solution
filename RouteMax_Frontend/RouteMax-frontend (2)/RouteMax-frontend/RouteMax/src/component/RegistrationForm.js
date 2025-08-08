// src/components/RegistrationForm.js
import React, { useState } from "react";
import axios from "axios";
import "./RegistrationForm.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Registering...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Registration successful!");
        setFormData({ username: "", email: "", password: "" });
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Registration failed. Server not responding or user exists.");
      }
    }
  };

  return (
    <div className="form-panel">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <button type="submit" className="sign-up-btn">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RegistrationForm;
