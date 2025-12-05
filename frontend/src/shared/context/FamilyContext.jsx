import { createContext, useContext, useState, useEffect } from "react";
import { useUserApi } from "../../shared/hooks/useUserApi";

const FamilyContext = createContext();

export function FamilyProvider({ userId, children }) {
  const { fetchUserFamilies } = useUserApi();
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState(null);

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

  const addFamily = (family) => setFamilies((prev) => [...prev, family]);
  const removeFamily = (familyId) => setFamilies((prev) => prev.filter(f => f.id !== familyId));

  return (
    <FamilyContext.Provider value={{ families, error, addFamily, removeFamily }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamiliesContext() {
  return useContext(FamilyContext);
}