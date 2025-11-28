import React, { useState } from "react";
import { useUserApi } from "../../../shared/hooks/useUserApi";
import { useFamilyApi } from "../../../shared/hooks/useFamilyApi";
import Modal from "../../../shared/components/modal/Modal";

export default function AddFamilyMemberModal({ family, onClose, onMemberAdded }) {
  const { fetchUser } = useUserApi();
  const { addFamilyMemberApi } = useFamilyApi();

  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Searches for a user by email using the useUserApi hook.
   * If a user is found, updates the `foundUser` state.
   * If no user is found or the request fails, sets an appropriate error message.
   */
  const handleSearch = async () => {
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
   * Adds the found user to the current family using the useFamilyApi hook.
   * Calls `onMemberAdded` to update the parent component's state and closes the modal.
   * If the API call fails, displays an error message.
   */
  const handleAddMember = async () => {
    if (!foundUser) return;

    try {
      await addFamilyMemberApi(family.id, foundUser.id);
      onMemberAdded(foundUser);
      onClose();
    } catch (err) {
      setError("Failed to add member");
    }
  };

  // Checks if the found user is already a member of the family
  const isAlreadyMember = foundUser && family.members.some(m => m.id === foundUser.id);

  return (
    <Modal title="Add Family Member" onClose={onClose}>
      {error && <p className="error">{error}</p>}

      <input
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {foundUser && (
        <div className="found-user">
          <p>
            {foundUser.firstName} ({foundUser.role})
          </p>
          <button
            onClick={handleAddMember}
            disabled={isAlreadyMember}
          >
            {isAlreadyMember ? "Already a member" : "Add to Family"}
          </button>
        </div>
      )}
    </Modal>
  );
}