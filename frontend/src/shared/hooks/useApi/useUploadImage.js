import { useState, useCallback } from "react";
import { uploadImage, fetchImage } from "../../api/uploadImage";

/**
 * Custom hook for uploading and fetching images via the API.
 * Handles loading and error states for operations like
 * uploading files and fetching images by file name.
 */
export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = useCallback(async (files) => {
    setLoading(true);
    setError(null);
    
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const res = await uploadImage(file);
        uploadedUrls.push(res.data);
      }
      return uploadedUrls;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload images");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

   const getImages = useCallback(async (fileNames) => {
    setLoading(true);
    setError(null);
    try {
      const urlsMap = {};
      for (const fileName of fileNames) {
        const blob = await fetchImage(fileName);
        urlsMap[fileName] = URL.createObjectURL(blob);
      }
      return urlsMap;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch images");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadFiles, getImages, loading, error };
};
