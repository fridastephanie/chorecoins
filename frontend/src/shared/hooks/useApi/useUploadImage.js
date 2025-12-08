import { useState, useCallback } from "react";
import { uploadImage, fetchImage } from "../../api/uploadImage";
import { useError } from "../../context/ErrorContext";

/**
 * Custom hook for uploading and fetching images via the API.
 * Handles loading and error states for operations like
 * uploading files and fetching images by file name.
 */
export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useError();

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
      const msg = "Failed to upload image(s)";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getImages = useCallback(async (fileNames) => {
    setLoading(true);
    setError(null);

    try {
      const urls = {};
      for (const name of fileNames) {
        const blob = await fetchImage(name);
        urls[name] = URL.createObjectURL(blob);
      }
      return urls;
    } catch (err) {
      const msg = "Failed to fetch image(s)";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return { uploadFiles, getImages, loading, error };
};