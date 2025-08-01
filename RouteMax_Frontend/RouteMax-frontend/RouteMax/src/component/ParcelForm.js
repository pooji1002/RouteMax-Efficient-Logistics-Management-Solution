import React, { useState } from "react";
import { addParcel } from "./ParcelService";
import "./ParcelForm.css";

export default function ParcelForm() {
  const [parcel, setParcel] = useState({
    senderName: "",
    recipientName: "",
    recipientEmail: "", // ✅ new field
    description: "",
    status: "Pending",
    trackingNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addParcel(parcel)
      .then(() => alert("Parcel added!"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-parcel-container">
      <h2>➕ Add Parcel</h2>
      <form onSubmit={handleSubmit} className="parcel-form">
        <input
          placeholder="Sender"
          value={parcel.senderName}
          onChange={(e) =>
            setParcel({ ...parcel, senderName: e.target.value })
          }
        />
        <input
          placeholder="Recipient"
          value={parcel.recipientName}
          onChange={(e) =>
            setParcel({ ...parcel, recipientName: e.target.value })
          }
        />
        {/* ✅ New field */}
        <input
          type="email"
          placeholder="Recipient Email"
          value={parcel.recipientEmail}
          onChange={(e) =>
            setParcel({ ...parcel, recipientEmail: e.target.value })
          }
          required
        />
        <input
          placeholder="Description"
          value={parcel.description}
          onChange={(e) =>
            setParcel({ ...parcel, description: e.target.value })
          }
        />
        <input
          placeholder="Status"
          value={parcel.status}
          onChange={(e) =>
            setParcel({ ...parcel, status: e.target.value })
          }
        />
        <input
          placeholder="Tracking #"
          value={parcel.trackingNumber}
          onChange={(e) =>
            setParcel({ ...parcel, trackingNumber: e.target.value })
          }
        />
        <button type="submit">Save Parcel</button>
      </form>
    </div>
  );
}

