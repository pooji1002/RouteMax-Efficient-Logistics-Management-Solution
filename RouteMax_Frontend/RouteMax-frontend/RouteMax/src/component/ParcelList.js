import React, { useEffect, useState } from "react";
import { getParcels, updateParcel } from "./ParcelService";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Parcel.css";

export default function ParcelList() {
  const [parcels, setParcels] = useState([]);
  const [editParcel, setEditParcel] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadParcels();
  }, []);

  const loadParcels = () => {
    getParcels()
      .then((res) => setParcels(res.data))
      .catch((err) => console.error(err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateParcel(editParcel.id, editParcel)
      .then(() => {
        setMessage("✅ Parcel updated successfully!");
        setEditParcel(null);
        loadParcels();
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to update parcel.");
      });
  };

  const handleSendEmail = (recipientEmail) => {
    axios
      .get(`http://localhost:8080/api/admin/parcels/track/email`, {
        params: { email: recipientEmail },
      })
      .then(() =>
        setMessage(`📧 Email sent successfully to ${recipientEmail}!`)
      )
      .catch(() =>
        setMessage(`❌ Failed to send email to ${recipientEmail}.`)
      );
  };

  return (
    <div className="parcel-container">
      <h2>📦 Parcels</h2>
      {message && <p className="message">{message}</p>}
      <Link to="/parcels/new" className="btn-add">➕ Add Parcel</Link>

      <table className="parcel-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Email</th> {/* ✅ Added */}
            <th>Status</th>
            <th>Tracking #</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.senderName}</td>
              <td>{p.recipientName}</td>
              <td>{p.recipientEmail}</td> {/* ✅ Show email */}
              <td>{p.status}</td>
              <td>{p.trackingNumber}</td>
              <td>
                <button onClick={() => setEditParcel(p)}>✏️ Edit</button>{" "}
                <button onClick={() => handleSendEmail(p.recipientEmail)}>
                  📧 Send Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editParcel && (
        <form onSubmit={handleUpdate} className="edit-parcel-form">
          <h3>Edit Parcel #{editParcel.id}</h3>
          <input
            type="text"
            value={editParcel.senderName}
            onChange={(e) =>
              setEditParcel({ ...editParcel, senderName: e.target.value })
            }
            placeholder="Sender Name"
            required
          />
          <input
            type="text"
            value={editParcel.recipientName}
            onChange={(e) =>
              setEditParcel({ ...editParcel, recipientName: e.target.value })
            }
            placeholder="Recipient Name"
            required
          />
 <select
  value={editParcel.status}
  onChange={(e) => setEditParcel({ ...editParcel, status: e.target.value })}
  required
  className="input-field"
>
  <option value="">Status</option>
  <option value="Dispatched">Dispatched</option>
  <option value="Picked Up">Picked Up</option>
  <option value="In Transit">In Transit</option>
  <option value="At Warehouse">At Warehouse</option>
  <option value="Delivered">Delivered</option>
  <option value="Failed">Failed</option>
</select>

          <input
            type="text"
            value={editParcel.trackingNumber}
            onChange={(e) =>
              setEditParcel({ ...editParcel, trackingNumber: e.target.value })
            }
            placeholder="Tracking Number"
          />
          <button type="submit">💾 Save Changes</button>
          <button type="button" onClick={() => setEditParcel(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
