import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/feedback/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFeedback(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(err.response?.data || "Failed to fetch feedback. Please check the server connection.");
        setFeedback([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);
  
  const filteredFeedback = feedback.filter(item => 
    (item.trackingNumber && item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.userName && item.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.comment && item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <style>
        {`
          /* --- Generic Page Container --- */
          .page-container {
              padding: 40px;
              background-color: #f0f2f5;
              min-height: 100vh;
          }

          /* --- Reusable Header --- */
          .page-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: linear-gradient(to left, #a8e063, #56ab2f);
              padding: 15px 30px;
              border-radius: 10px;
              margin-bottom: 30px;
              color: white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .page-header h2 {
              margin: 0;
              font-size: 28px;
              flex-grow: 1;
              text-align: center;
          }

          .back-button {
              color: white;
              text-decoration: none;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              font-weight: bold;
              transition: color 0.3s ease;
          }

          .back-button:hover {
              color: #e6e6e6;
          }

          .back-arrow {
              font-size: 18px;
          }

          /* --- Reusable Form Styles --- */
          .form-style {
              background-color: #fff;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              gap: 16px;
              max-width: 600px;
              margin: 0 auto;
          }

          .form-style input,
          .form-style select {
              padding: 12px 16px;
              border-radius: 6px;
              border: 1px solid #ccc;
              font-size: 14px;
          }

          .form-style button[type="submit"],
          .form-style button[type="button"] {
              background-color: #56ab2f;
              color: white;
              font-weight: bold;
              padding: 12px;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              transition: background-color 0.3s;
          }

          .form-style button[type="submit"]:hover {
              background-color: #3e8e41;
          }

          .edit-user-form {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              margin-bottom: 30px;
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              align-items: center;
              max-width: 800px;
              margin: 20px auto;
          }

          .edit-user-form input,
          .edit-user-form select {
              flex: 1;
              padding: 12px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-size: 15px;
              min-width: 180px;
          }

          /* --- Reusable Table Styles --- */
          .table-container {
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              overflow: hidden;
          }

          .users-table {
              width: 100%;
              border-collapse: collapse;
          }

          .users-table th,
          .users-table td {
              text-align: left;
              padding: 15px;
              border-bottom: 1px solid #eee;
          }

          .users-table th {
              background-color: #f8f9fa;
              font-weight: 600;
              color: #555;
              text-transform: uppercase;
              font-size: 12px;
          }

          .users-table tr:hover {
              background-color: #f1f1f1;
          }

          .users-table td:last-child button {
              margin-right: 8px;
          }

          .users-table td button {
              padding: 8px 15px;
              border: 1px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s ease, border-color 0.3s ease;
          }

          .users-table td button:first-of-type {
              background-color: #ffc107;
              color: #333;
              border-color: #ffc107;
          }

          .users-table td button:first-of-type:hover {
              background-color: #e0a800;
              border-color: #e0a800;
          }

          .users-table td button:last-of-type {
              background-color: #dc3545;
              color: white;
              border-color: #dc3545;
          }

          .users-table td button:last-of-type:hover {
              background-color: #c82333;
              border-color: #c82333;
          }

          .status-message {
              padding: 10px;
              border-radius: 5px;
              margin: 20px;
              font-weight: 500;
              text-align: center;
          }

          .status-message.success {
              background-color: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
          }

          .status-message.error {
              background-color: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
          }

          /* --- Search Bar Styles --- */
          .search-container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              margin-bottom: 20px;
          }

          .search-input {
              width: 100%;
              padding: 12px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-size: 16px;
          }
        `}
      </style>
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <Link to="/admin/dashboard" className="back-button">
            <FaArrowLeft className="back-arrow" /> Back to Dashboard
          </Link>
          <h2>View User Feedback</h2>
        </div>

        {/* Search Bar Container */}
        <div className="search-container">
          <input 
            type="text"
            placeholder="Search by tracking number, user, or comment..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="table-container">
          {isLoading && (
            <p className="status-message loading-message">Loading feedback...</p>
          )}
          {error && (
            <p className="status-message error">{error}</p>
          )}
          
          {!isLoading && !error && (
            filteredFeedback.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>User Name</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((f, index) => (
                    <tr key={index}>
                      <td>{f.trackingNumber || "N/A"}</td>
                      <td>{f.userName || "N/A"}</td>
                      <td>{f.rating} / 5</td>
                      <td>{f.comment}</td>
                      <td>
                        {f.timestamp ? new Date(f.timestamp).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="status-message no-feedback-message">No feedback has been submitted yet.</p>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default AdminFeedbackPage;
