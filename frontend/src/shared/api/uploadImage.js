import api from "./api";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const fetchImage = async (fileName) => {
  const res = await api.get(`/uploads/image/${fileName}`, { responseType: "blob" });
  return res.data; 
};