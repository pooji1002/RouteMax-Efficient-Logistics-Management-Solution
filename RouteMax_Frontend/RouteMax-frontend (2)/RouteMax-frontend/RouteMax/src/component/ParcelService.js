import axios from "axios";

// Define a base URL for all API calls
const API_BASE_URL = "http://localhost:8080/api";

// A helper function to get the authorization header from local storage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// --- Admin & Shared API Endpoints ---
// ✅ CORRECTED: All these API calls now use the correct base URL.
// The backend's security configuration will handle the role checks.

export const getParcels = () => 
    axios.get(`${API_BASE_URL}/parcels`, { headers: getAuthHeader() });

export const getParcelById = (id) => 
    axios.get(`${API_BASE_URL}/parcels/${id}`, { headers: getAuthHeader() });

export const addParcel = (data) => 
    axios.post(`${API_BASE_URL}/parcels`, data, { headers: getAuthHeader() });

export const updateParcel = (id, data) => 
    axios.put(`${API_BASE_URL}/parcels/${id}`, data, { headers: getAuthHeader() });

export const deleteParcel = (id) =>
    axios.delete(`${API_BASE_URL}/parcels/${id}`, { headers: getAuthHeader() });

export const sendEmail = (email) =>
    axios.get(`${API_BASE_URL}/parcels/track/email?email=${email}`, { headers: getAuthHeader() });

// --- User API Endpoints ---
export const getParcelHistory = () => {
    return axios.get(`${API_BASE_URL}/parcels/history`, { headers: getAuthHeader() });
};

// --- Public API Endpoints (no auth needed) ---
export const trackParcelPublic = (trackingNumber) => {
  return axios.get(`${API_BASE_URL}/parcels/track/${trackingNumber}`);
};
