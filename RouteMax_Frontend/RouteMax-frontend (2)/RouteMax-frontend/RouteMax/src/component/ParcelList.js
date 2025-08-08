import React, { useEffect, useState } from "react";
import { 
  getParcels, 
  updateParcel, 
  deleteParcel, 
  sendEmail 
} from "./ParcelService";
import { Link } from "react-router-dom";
import "./Parcel.css";

export default function ParcelList() {
  const [parcels, setParcels] = useState([]);
  const [editParcel, setEditParcel] = useState(null);
  const [message, setMessage] = useState("");

  const loadParcels = () => {
    getParcels()
      .then((res) => setParcels(res.data))
      .catch((err) => {
        console.error("Error loading parcels:", err);
        setMessage("❌ Failed to load parcels. Please log in as an administrator.");
      });
  };

  useEffect(() => {
    loadParcels();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateParcel(editParcel.id, editParcel)
      .then(() => {
        setMessage("✅ Parcel updated successfully!");
        setEditParcel(null);
        loadParcels();
      })
      .catch((err) => {
        console.error("Error updating parcel:", err);
        setMessage("❌ Failed to update parcel.");
      });
  };

  const handleSendEmail = (recipientEmail) => {
    sendEmail(recipientEmail)
      .then(() =>
        setMessage(`📧 Email sent successfully to ${recipientEmail}!`)
      )
      .catch((error) => {
        console.error("Error sending email:", error);
        if (error.response && error.response.status === 403) {
          setMessage("❌ Access Denied. Please log in with an Admin account.");
        } else {
          setMessage(`❌ Failed to send email to ${recipientEmail}.`);
        }
      });
  };

  const handleDelete = (parcelId) => {
    // You can't use window.confirm, so this will delete directly.
    deleteParcel(parcelId)
      .then(() => {
        setMessage(`🗑️ Parcel ${parcelId} deleted successfully!`);
        loadParcels();
      })
      .catch(error => {
        console.error("Error deleting parcel:", error);
        if (error.response && error.response.status === 403) {
          setMessage("❌ Access Denied. You do not have permission to delete parcels.");
        } else {
          setMessage(`❌ Failed to delete parcel ${parcelId}.`);
        }
      });
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
            <th>Email</th>
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
              <td>{p.recipientEmail}</td>
              <td>{p.status}</td>
              <td>{p.trackingNumber}</td>
              <td>
                <button onClick={() => setEditParcel(p)}>✏️ Edit</button>{" "}
                <button onClick={() => handleDelete(p.id)}>🗑️ Delete</button>{" "}
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
          <input
            type="text"
            value={editParcel.description || ""}
            onChange={(e) =>
              setEditParcel({ ...editParcel, description: e.target.value })
            }
            placeholder="Description"
          />
          <input
            type="text"
            value={editParcel.status}
            onChange={(e) =>
              setEditParcel({ ...editParcel, status: e.target.value })
            }
            placeholder="Status"
            
          />
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
