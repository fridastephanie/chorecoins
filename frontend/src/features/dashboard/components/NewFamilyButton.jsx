import NewFamilyModal from "./NewFamilyModal";
import { useState } from "react";

export default function NewFamilyButton({ onFamilyCreated }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        aria-label="Create a new family"
      >
        New Family
      </button>
      
      {showModal && (
        <NewFamilyModal
          onClose={() => setShowModal(false)}
          onFamilyCreated={onFamilyCreated}
        />
      )}
    </>
  );
}