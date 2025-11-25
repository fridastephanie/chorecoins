import api from "./api";

export const createFamily = (data) =>
  api.post("/families", data);

export const getFamily = (id) =>
  api.get(`/families/${id}`);

export const addMember = (familyId, userId) =>
  api.post(`/families/${familyId}/members/${userId}`);
