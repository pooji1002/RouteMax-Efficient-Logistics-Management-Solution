import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    enabled: true,
  });
  const [editUser, setEditUser] = useState(null); // 🌟 state for user being edited
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("❌ Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/admin/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage("✅ User added successfully!");
      setNewUser({ username: "", email: "", password: "", role: "USER", enabled: true });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error);
      setMessage("❌ Failed to add user.");
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error);
      setMessage("❌ Failed to delete user.");
    }
  };

  // ✅ Edit user submit
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage("✅ User updated successfully!");
      setEditUser(null); // close edit form
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error.response?.data || error);
      setMessage("❌ Failed to update user.");
    }
  };

  // ✅ Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      {message && <p className="message">{message}</p>}

      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* ➕ Add User */}
      <form onSubmit={handleAddUser} className="add-user-form">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* ✏️ Edit User (popup form below table) */}
      {editUser && (
        <form onSubmit={handleEditUser} className="edit-user-form">
          <h3>Edit User: {editUser.username}</h3>
          <input
            type="text"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            required
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="(leave blank to keep same)"
            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
          />
          <select
            value={editUser.role}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
        </form>
      )}

      {/* 📋 Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => setEditUser(u)}>Edit</button>
                <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
