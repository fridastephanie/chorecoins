import { useState } from "react";

export const useFileUpload = (allowedTypes = ["image/jpeg", "image/png", "image/webp"]) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Handles file selection from an <input type="file"> element.
   * Filters files based on allowedTypes and generates preview URLs.
   * Sets an error message if any selected file has an invalid type.
   */
  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];

    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("Only JPEG, PNG or WEBP images are allowed");
      return;
    }

    setError(null);
    setFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  /**
   * Resets the hook state, clearing selected files, preview URLs, and errors.
   */
  const reset = () => {
    setFiles([]);
    setPreviewUrls([]);
    setError(null);
  };

  return { files, previewUrls, error, handleFileChange, reset };
};