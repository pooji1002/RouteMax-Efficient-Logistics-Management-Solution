import React, { useState } from "react";
import axios from "axios";
import "./Parcel.css";

function TrackParcel() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/parcels/track/${trackingNumber}`
      );
      setParcel(response.data);
      setError("");

      await axios.get(`http://localhost:8080/api/admin/parcels/track/email`, {
        params: { email: response.data.recipientEmail },
      });
    } catch (err) {
      setParcel(null);
      setError("❌ Parcel not found or server error.");
    }
  };

  return (
    <>
      <div className="navbar">
        <a href="/user">User</a>
        <a href="/admin">Admin</a>
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
            />
            <button onClick={handleTrack}>Track</button>
          </div>

          {error && <p className="error">{error}</p>}

          {parcel && (
            <div className="parcel-info">
              <p><strong>Sender:</strong> {parcel.senderName}</p>
              <p><strong>Recipient:</strong> {parcel.recipientName}</p>
              <p><strong>Description:</strong> {parcel.description}</p>
           
              <p><strong>Status:</strong> <span className="status">{parcel.status}</span></p>




              <p><strong>Email Sent To:</strong> {parcel.recipientEmail}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TrackParcel;
