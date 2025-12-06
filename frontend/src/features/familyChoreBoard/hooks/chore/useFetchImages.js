import { useState, useEffect, useCallback } from "react";
import { useUploadImage } from "../../../../shared/hooks/useApi/useUploadImage";

export const useFetchImages = (fileNames) => {
  const { getImages } = useUploadImage();
  const [imageUrlsMap, setImageUrlsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches images from the backend using `getImages` from `useUploadImage`.
   * Generates object URLs for each fetched image and updates `imageUrlsMap`.
   * Handles loading and error states.
   */
  const fetchImages = useCallback(async () => {
    if (!fileNames?.length) return;

    setLoading(true);
    setError(null);

    try {
      const urlsMap = await getImages(fileNames);
      setImageUrlsMap(urlsMap);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, [fileNames, getImages]);

 /**
  * Automatically fetches images when `fileNames` changes
  * and revokes object URLs when the component unmounts or fileNames change.
  */
  useEffect(() => {
    fetchImages();

    return () => {
      Object.values(imageUrlsMap).forEach(url => URL.revokeObjectURL(url));
    };
  }, [fetchImages]);

  return { imageUrlsMap, loading, error };
};
