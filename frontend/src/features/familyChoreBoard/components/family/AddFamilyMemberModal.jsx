import React, { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import useAddFamilyMember from "../../hooks/family/useAddFamilyMember";
import MemberSearchInput from "./MemberSearchInput";
import FoundUserCard from "./FoundUserCard"

export default function AddFamilyMemberModal({ family, onClose, onMemberAdded }) {
  const [email, setEmail] = useState("");
  const { foundUser, error, searchUser, addMember } = useAddFamilyMember(family.id);

  const handleSearch = () => searchUser(email);
  const handleAdd = async () => {
    const user = await addMember();
    if (user) onMemberAdded(user) && onClose();
  };

  const isAlreadyMember = foundUser && family.members.some(m => m.id === foundUser.id);

  return (
    <Modal title="Add Family Member" onClose={onClose} ariaLabel="Add family member modal">
      <div className="member-search input-group">
        <MemberSearchInput
          id="member-email"
          labelText="Enter email to search:" 
          email={email}
          setEmail={setEmail}
          onSearch={handleSearch}
        />
      </div>

      {error && <p className="error" role="alert" aria-live="polite">{error}</p>}

      {foundUser && (
        <FoundUserCard
          user={foundUser}
          onAdd={handleAdd}
          isAlreadyMember={isAlreadyMember}
          aria-label={`User card for ${foundUser.firstName} ${foundUser.lastName}`}
        />
      )}
    </Modal>
  );
}
