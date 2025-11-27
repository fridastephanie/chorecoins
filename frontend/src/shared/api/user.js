import api from "./api";

export const registerUser = (data) =>
  api.post("/users/register", data);

export const getUser = (id) => 
  api.get(`/users/${id}`);

export const getUserFamilies = (userId) =>
  api.get(`/users/${userId}/families`);