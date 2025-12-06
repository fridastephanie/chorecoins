import { useState } from "react";
import { useUserApi } from "../../../../shared/hooks/useApi/useUserApi";
import { useFamilyApi } from "../../../../shared/hooks/useApi/useFamilyApi";

export default function useAddFamilyMember(familyId) {
  const { fetchUser } = useUserApi();
  const { addFamilyMemberApi } = useFamilyApi();

  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Searches for a user by email and updates `foundUser` state.
   * Sets an error message if no user is found.
   */
  const searchUser = async (email) => {
    try {
      setError(null);
      const user = await fetchUser(email);
      setFoundUser(user);
    } catch (err) {
      setError("No user found with this email");
      setFoundUser(null);
    }
  };

  /**
   * Adds the found user to the family via the API.
   * Returns the user if successful, or null if it fails.
   */
  const addMember = async () => {
    if (!foundUser) return;
    try {
      await addFamilyMemberApi(familyId, foundUser.id);
      return foundUser;
    } catch (err) {
      setError("Failed to add member");
      return null;
    }
  };

  return { foundUser, error, searchUser, addMember, setFoundUser, setError };
}