import { useState, useEffect } from "react";
import { useChoreApi } from "../../shared/api/useChoreApi";
import { useFamilyApi } from "../../shared/api/useFamilyApi";

export const useFamilyChores = (familyId, currentUser) => {
  const { getChoresForFamily, getChoresForChild } = useChoreApi();
  const { getFamily } = useFamilyApi();
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
    const familyData = await getFamily(familyId);
    let choresData;
    if (filterOwn && currentUser.role === "CHILD") {
      choresData = await getChoresForChild(currentUser.id);
    } else {
      choresData = await getChoresForFamily(familyId);
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