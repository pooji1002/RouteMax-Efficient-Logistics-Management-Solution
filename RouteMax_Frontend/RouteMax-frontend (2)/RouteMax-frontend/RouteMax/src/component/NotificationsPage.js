import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotificationsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      const storedNotifications = localStorage.getItem(`notifications_${user.email}`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        setNotifications([]);
      }
    } else {
      navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleClearNotifications = () => {
    if (user && user.email) {
      localStorage.removeItem(`notifications_${user.email}`);
      setNotifications([]);
    }
  };

  const handleGoBack = () => {
    navigate('/user/dashboard');
  };

  return (
    <>
      <style>
        {`
        .notifications-page-container {
          padding: 30px;
          background-color: #f9fafb;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          color: #2c3e50;
        }

        .notifications-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .notifications-page-header h2 {
          font-size: 28px;
          color: #3498db;
          margin: 0;
        }

        .back-button, .clear-button {
          padding: 8px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #5a6268;
        }

        .clear-button:hover {
          background-color: #c0392b;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .notification-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 18px 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .notification-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        .notification-card-message {
          font-size: 16px;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
        }

        .notification-card-time {
          font-size: 12px;
          color: #888;
          align-self: flex-end;
        }

        .no-notifications-message {
          text-align: center;
          color: #7f8c8d;
          font-style: italic;
          padding: 50px;
          border: 1px dashed #bdc3c7;
          border-radius: 8px;
          background-color: #ecf0f1;
        }
        `}
      </style>

      <div className="notifications-page-container">
        <div className="notifications-page-header">
          <button onClick={handleGoBack} className="back-button">← Back to Dashboard</button>
          <h2>All Notifications</h2>
          <button onClick={handleClearNotifications} className="clear-button">Clear All</button>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p className="no-notifications-message">You have no notifications yet.</p>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="notification-card">
                <p className="notification-card-message">{notif.message}</p>
                <span className="notification-card-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default NotificationsPage;
