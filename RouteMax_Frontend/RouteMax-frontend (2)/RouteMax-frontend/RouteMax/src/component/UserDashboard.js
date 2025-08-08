import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Dashboard.css";
// Import the FeedbackForm component and CSS for the modal
import FeedbackForm from "./FeedbackForm.js";
import "./Feedback.css";

function UserDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    // --- New state for parcel history and feedback form ---
    const [parcels, setParcels] = useState([]);
    const [message, setMessage] = useState("");
    // New state to track which parcel's feedback form is open
    const [openFeedbackFormId, setOpenFeedbackFormId] = useState(null);

    // Fetches the parcel history for the logged-in user
    const fetchParcelHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("❌ You must be logged in to view your parcel history.");
                return;
            }
            // ✅ Placeholder for API call to get user's parcels
            const response = await axios.get("http://localhost:8080/api/parcels/history", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setParcels(response.data);
            setMessage("");
        } catch (error) {
            console.error("Error fetching parcel history:", error);
            setMessage("❌ Failed to load parcel history.");
        }
    };

    useEffect(() => {
        fetchParcelHistory();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Clear the token as well
        navigate("/");
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    // Function to open the feedback form
    const openFeedbackForm = (trackingId) => {
        setOpenFeedbackFormId(trackingId);
    };

    // Note: The closeFeedbackForm function is removed as the new FeedbackForm doesn't
    // contain modal logic and is rendered inline.

    return (
        <div className="dashboard">
            <div className="header">
            <div className="logo" style={{ color: 'white' }}>RouteGenius</div>

                <div className="header-icons">
                    <div
                        className="profile-icon-container"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                            alt="Profile"
                            className="profile-icon"
                        />
                        {showProfileDropdown && (
                            <div className="dropdown">
                                <div className="dropdown-info">
                                    <strong>{user?.name || user?.username}</strong>
                                    <p>{user?.email}</p>
                                </div>
                                <hr />
                                <button className="dropdown-btn" onClick={handleEditProfile}>
                                    Edit Profile
                                </button>
                                <button className="dropdown-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="hero">
                <h2>Welcome, {user?.displayName || user?.name || user?.username || 'User'} 👋</h2>
                    <p>Manage your deliveries, track parcels, and stay updated.</p>
                    <Link to="/track" className="track-link">
                        📦 Track Parcel
                    </Link>
                </div>

                <div className="cards">
                    {/* ... Existing cards ... */}
                    <div className="card">
                        <h3>📦 Track Parcel</h3>
                        <p>Enter your tracking ID to view your delivery status and updates.</p>
                        <Link to="/track">Track Details →</Link>
                    </div>

                    <div className="card">
                        <h3>🧾 Parcel History</h3>
                        <p>Check your previous orders and delivery statuses.</p>
                        <Link to="/history">View History →</Link>
                    </div>

                    <div className="card">
                        <h3>📬 Help & Support</h3>
                        <p>Need help? Reach out to our support team easily.</p>
                        <Link to="/support">Contact Support →</Link>
                    </div>

                 
                </div>
                
                {/* --- New section for user's parcel history --- */}
                <div className="user-parcels-section">
                    <h3>Your Parcels</h3>
                    {message && <p className="status-message">{message}</p>}
                    
                    {parcels.length > 0 ? (
                        <table className="parcel-table">
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Recipient</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parcels.map((p) => (
                                    <React.Fragment key={p.trackingNumber}>
                                        <tr key={p.trackingNumber}>
                                            <td>{p.trackingNumber}</td>
                                            <td>{p.recipientName}</td>
                                            <td><span className={`status-${p.status.toLowerCase()}`}>{p.status}</span></td>
                                            <td>
                                                {/* ✅ Conditional rendering of the Feedback button */}
                                                {p.status === 'Delivered' && (
                                                    <button 
                                                        className="feedback-btn" 
                                                        onClick={() => openFeedbackForm(p.trackingNumber)}
                                                    >
                                                        ✍️ Give Feedback
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {/* Render the FeedbackForm inline when the button is clicked */}
                                        {openFeedbackFormId === p.trackingNumber && (
                                            <tr>
                                                <td colSpan="4">
                                                    <FeedbackForm trackingNumber={p.trackingNumber} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !message && <p>You have no parcels in your history.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
