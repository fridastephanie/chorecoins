import { useState } from "react";
import Modal from "../../../shared/components/modal/Modal";
import { useError } from "../../../shared/context/ErrorContext";
import { useFamilyApi } from "../../../shared/hooks/useFamilyApi";

export default function NewFamilyModal({ onClose, onFamilyCreated }) {
  const { showError, clearError } = useError();
  const { createNewFamily, loading } = useFamilyApi(); 
  const [familyName, setFamilyName] = useState("");

  /**
   * Handles form submission for creating a new family.
   * Calls createNewFamily from the useFamilyApi hook, updates parent state with the new family,
   * and closes the modal. Displays error using the error context if the creation fails.
   */
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
        <input
          type="text"
          placeholder="Family Name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Family"}
        </button>
      </form>
    </Modal>
  );
}