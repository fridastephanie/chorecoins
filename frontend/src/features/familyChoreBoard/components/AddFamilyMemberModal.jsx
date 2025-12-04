import React, { useState } from "react";
import { useUserApi } from "../../../shared/hooks/useUserApi";
import { useFamilyApi } from "../../../shared/hooks/useFamilyApi";
import Modal from "../../../shared/components/Modal";

export default function AddFamilyMemberModal({ family, onClose, onMemberAdded }) {
  const { fetchUser } = useUserApi();
  const { addFamilyMemberApi } = useFamilyApi();

  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState(null);

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
          <strong>
            {foundUser.firstName} ({foundUser.role})
          </strong>
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