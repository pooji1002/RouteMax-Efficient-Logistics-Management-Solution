import React, { useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import "./AddUser.css";

function AddUserPage() {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    enabled: true,
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (newUser.password.length < 6) {
        setMessage("❌ Password must be at least 6 characters.");
        return;
    }

    try {
      await axios.post("http://localhost:8080/api/admin/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage("✅ User added successfully!");
      setNewUser({ username: "", email: "", password: "", role: "USER", enabled: true });
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error);
      setMessage("❌ Failed to add user. Check the console for details.");
    }
  };

  return (
    <div className="add-user-page-container">
      <div className="form-header">
        <FaUserPlus size={30} style={{ marginRight: '10px' }} />
        <h2>Add New User</h2>
      </div>

      {message && (
        <p className={`status-message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleAddUser} className="form-style">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min. 6 characters)"
          value={newUser.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUserPage;
