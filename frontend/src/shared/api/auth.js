import api from "./api";

/* REGISTER */
export const registerUser = (data) =>
  api.post("/users/register", data);

/* LOGIN */
export const loginUser = (credentials) =>
  api.post("/auth/login", credentials);

/* LOGOUT */
export const logoutUser = () =>
  api.post("/auth/logout");