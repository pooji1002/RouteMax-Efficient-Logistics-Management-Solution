import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewUsersPage.css"; // We'll create this CSS file

function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

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
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error.response?.data || error);
      setMessage("❌ Failed to update user.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-users-page-container">
      <div className="page-header">
        <h2>View and Manage Users</h2>
      </div>

      {message && (
        <p className={`status-message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <input
        type="text"
        placeholder="Search by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

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
          <button type="button" onClick={() => setEditUser(null)}>
            Cancel
          </button>
        </form>
      )}

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

export default ViewUsersPage;