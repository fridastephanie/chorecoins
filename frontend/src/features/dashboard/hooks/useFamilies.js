import { useState, useEffect, useRef } from "react";
import { getUserFamilies } from "../../../shared/api/user";

export default function useFamilies(userId) {
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState(null);
  const fetched = useRef(false);

  const fetchFamilies = async () => {
    if (!userId || fetched.current) return;

    fetched.current = true;

    try {
      const res = await getUserFamilies(userId);
      setFamilies(res.data);
    } catch (err) {
      console.error("Failed to fetch families:", err);
      setError("Failed to load families.");
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, [userId]);

  const addFamily = (family) => {
    setFamilies((prev) => [...prev, family]);
  };

  return {
    families,
    error,
    addFamily,
  };
}