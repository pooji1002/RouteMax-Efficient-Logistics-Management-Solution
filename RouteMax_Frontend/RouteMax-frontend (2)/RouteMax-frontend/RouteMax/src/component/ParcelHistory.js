import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getParcelHistory } from './ParcelService';
import './Dashboard.css';

const ParcelHistory = () => {
    const [parcels, setParcels] = useState([]);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        getParcelHistory()
            .then(response => {
                setParcels(response.data);
            })
            .catch(err => {
                setError('Failed to fetch parcel history. Please try again later.');
                console.error(err);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const styles = {
        card: {
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        cardHeader: {
            marginTop: 0,
            color: '#0056b3',
        },
        historySection: {
            marginTop: '15px',
            borderTop: '1px solid #eee',
            paddingTop: '10px',
        },
        historyList: {
            listStyleType: 'none',
            paddingLeft: 0,
        },
        error: {
            color: 'red',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '20px'
        }
    };

    return (
        <div className="dashboard">
            <div className="header">
                <div className="logo">
                    <Link to="/user/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>RouteMax</Link>
                </div>
                <div className="profile-icon-container">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                        alt="Profile"
                        className="profile-icon"
                    />
                </div>
            </div>

            <div className="content">
                <h2>Your Parcel History</h2>
                <hr />

                {error && <p style={styles.error}>{error}</p>}

                {!error && parcels.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>You have no parcel history.</p>
                )}

                {parcels.map(parcel => (
                    <div key={parcel.id} style={styles.card}>
                        <h3 style={styles.cardHeader}>Tracking ID: {parcel.trackingNumber}</h3>
                        <p><strong>Current Status:</strong> {parcel.status}</p>
                        <p><strong>Description:</strong> {parcel.description}</p>
                        <div style={styles.historySection}>
                            <h4>Status Log:</h4>
                            <ul style={styles.historyList}>
                                {parcel.statusHistory
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map(update => (
                                        <li key={update.id}>
                                            {new Date(update.timestamp).toLocaleString()}: <strong>{update.status}</strong>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParcelHistory;
