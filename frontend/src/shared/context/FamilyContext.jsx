import { createContext, useContext, useState, useEffect } from "react";
import { useUserApi } from "../hooks/useApi/useUserApi";

const FamilyContext = createContext();

export function FamilyProvider({ userId, children }) {
  const { fetchUserFamilies } = useUserApi();
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState(null);

 /**
  * Loads the families for the given user when the userId changes.
  * Stores the families in state and handles errors during the fetch.
  */
  useEffect(() => {
    if (!userId) return;

    const loadFamilies = async () => {
      try {
        const res = await fetchUserFamilies(userId);
        setFamilies(res);
      } catch (err) {
        setError("Failed to load families.");
      }
    };

    loadFamilies();
  }, [userId, fetchUserFamilies]);

 /**
  * Adds a new family to the current state.
  */
  const addFamily = (family) => setFamilies((prev) => [...prev, family]);

 /**
  * Removes a family from the current state by its ID.
  */
  const removeFamily = (familyId) => setFamilies((prev) => prev.filter(f => f.id !== familyId));

  return (
    <FamilyContext.Provider value={{ families, error, addFamily, removeFamily }}>
      {children}
    </FamilyContext.Provider>
  );
}

/**
 * Custom hook to access the FamilyContext.
 */
export function useFamiliesContext() {
  return useContext(FamilyContext);
}