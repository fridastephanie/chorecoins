import { useState, useEffect, useRef } from "react";
import Modal from "../../../shared/components/Modal";
import InputField from "../../../shared/components/InputField"; 
import { useError } from "../../../shared/context/ErrorContext";
import { useFamilyApi } from "../../../shared/hooks/useApi/useFamilyApi";

export default function NewFamilyModal({ onClose, onFamilyCreated }) {
  const { showError, clearError } = useError();
  const { createNewFamily, loading } = useFamilyApi();
  const [familyName, setFamilyName] = useState("");
  const inputRef = useRef(null);

   useEffect(() => {
    inputRef.current?.focus(); 
   }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!familyName.trim()) {
      showError("Family name cannot be empty", "create-family");
      return;
    }

    try {
      const newFamily = await createNewFamily({ familyName });
      onFamilyCreated(newFamily);
      onClose();
    } catch (err) {
      showError(err, "create-family");
    }
  };

  return (
    <Modal title="New Family" onClose={onClose} ariaLabel="Create new family modal">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="input-group">
            <label htmlFor="familyName">Family Name</label>
            <InputField
            id="familyName"
            name="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family Name"
            type="text"
            ref={inputRef}
            required
            aria-required="true"
            />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          aria-busy={loading ? "true" : "false"}
          aria-label="Create family"
        >
          {loading ? "Creating..." : "Create Family"}
        </button>
      </form>
    </Modal>
  );
}