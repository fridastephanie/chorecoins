import { useState } from "react";
import Modal from "../../../shared/components/Modal";
import InputField from "../../../shared/components/InputField"; 
import { useError } from "../../../shared/context/ErrorContext";
import { useFamilyApi } from "../../../shared/hooks/useFamilyApi";

export default function NewFamilyModal({ onClose, onFamilyCreated }) {
  const { showError, clearError } = useError();
  const { createNewFamily, loading } = useFamilyApi();
  const [familyName, setFamilyName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const newFamily = await createNewFamily({ familyName });
      onFamilyCreated(newFamily);
      onClose();
    } catch (err) {
      showError(err, "create-family");
    }
  };

  return (
    <Modal title="New Family" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        
        <InputField
          name="familyName"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Family Name"
          type="text"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Family"}
        </button>
      </form>
    </Modal>
  );
}
