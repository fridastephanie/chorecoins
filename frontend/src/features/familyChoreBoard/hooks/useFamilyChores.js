import { useState, useEffect } from "react";
import { useChoreApi } from "../../../shared/hooks/useApi/useChoreApi";
import { useFamilyApi } from "../../../shared/hooks/useApi/useFamilyApi";

export const useFamilyChores = (familyId, currentUser) => {
  const { fetchChoresForFamily, fetchChoresForChild } = useChoreApi();
  const { fetchFamilyApi } = useFamilyApi();
  const [family, setFamily] = useState(null);
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOwn, setFilterOwn] = useState(false);

   /**
   * Fetches family and chore data from the API.
   * Updates state for `family`, `chores`, and `loading`.
   */
  const loadData = async () => {
    setLoading(true);
    const familyData = await fetchFamilyApi(familyId);
    let choresData;
    if (filterOwn && currentUser.role === "CHILD") {
      choresData = await fetchChoresForChild(currentUser.id);
    } else {
      choresData = await fetchChoresForFamily(familyId);
    }
    setFamily(familyData);
    setChores(choresData);
    setLoading(false);
  };

  /**
  * Automatically loads data whenever `familyId` changes.
  */
  useEffect(() => { loadData(); }, [familyId, filterOwn]);

  return { family, chores, loading, filterOwn, setFilterOwn, reload: loadData };
};