import { useState } from "react";
import { createFamily } from "../../../shared/api/family";
import Modal from "../../../shared/components/modal/Modal";
import { useError } from "../../../shared/context/ErrorContext";

export default function NewFamilyModal({ onClose, onFamilyCreated }) {
  const { showError, clearError } = useError();
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const res = await createFamily({ familyName });
      onFamilyCreated(res.data);
      onClose();
    } catch (err) {
      showError(err, "create-family");
    } finally {
      setLoading(false);
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
