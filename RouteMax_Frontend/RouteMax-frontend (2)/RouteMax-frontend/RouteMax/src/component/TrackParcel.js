import React, { useState } from "react";
import axios from "axios";
import "./Parcel.css";

function TrackParcel() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const handleTrack = async () => {
    setLoading(true); // ✅ Set loading to true on start
    setError("");
    setParcel(null);

    try {
      // ✅ CORRECTED URL: Calling the public-facing endpoint to track a parcel.
      // This endpoint is not prefixed with `/api/admin` and is accessible to all users.
      const response = await axios.get(
        `http://localhost:8080/api/parcels/track/${trackingNumber}`
      );
      
      setParcel(response.data);
      setError("");

      // ✅ REMOVED: The call to `/api/admin/parcels/track/email` was removed.
      // This is an admin-specific action and should not be triggered from a
      // public-facing user component.
      
    } catch (err) {
      setParcel(null);
      // ✅ Improved error handling to be more specific
      setError(err.response?.status === 404 ? "❌ Parcel not found." : "❌ An error occurred while tracking your parcel.");
    } finally {
      setLoading(false); // ✅ Set loading to false on finish
    }
  };

  return (
    <>
      <div className="navbar">
        <a href="/user">User</a>
        {/* <a href="/admin">Admin</a> */}
      </div>
      <div className="track-wrapper">
        <div className="track-card">
          <h2>📦 Track Your Parcel</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={loading} // ✅ Disable input while loading
            />
            <button onClick={handleTrack} disabled={loading}>
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {parcel && (
            <div className="parcel-info">
              <p><strong>Sender:</strong> {parcel.senderName}</p>
              <p><strong>Recipient:</strong> {parcel.recipientName}</p>
              <p><strong>Description:</strong> {parcel.description}</p>
            
              <p><strong>Status:</strong> <span className="status">{parcel.status}</span></p>

              {/* ✅ REMOVED: This line was misleading and is no longer needed */}
              {/* <p><strong>Email Sent To:</strong> {parcel.recipientEmail}</p> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TrackParcel;
