import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/parcels";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getParcels = () => axios.get(API_URL, getAuthHeader());
export const getParcelById = (id) => axios.get(`${API_URL}/${id}`, getAuthHeader());
export const addParcel = (data) => axios.post(API_URL, data, getAuthHeader());
export const updateParcel = (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeader());
// ✅ Add this:
export const sendEmail = (email) =>
  axios.get(`${API_URL}/track/email?email=${email}`, getAuthHeader());