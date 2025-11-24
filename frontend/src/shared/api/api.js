import axios from "axios";

const API_BASE = "http://localhost:8080/api";

/* REGISTER */
export const registerUser = (data) =>
  axios.post(`${API_BASE}/users/register`, data);

/* LOGIN */
export const loginUser = (credentials) =>
  axios.post(`${API_BASE}/auth/login`, credentials);

/* LOGOUT */
export const logoutUser = (token) =>
  axios.post(
    `${API_BASE}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );