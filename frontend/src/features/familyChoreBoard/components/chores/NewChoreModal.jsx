import React, { useState } from "react";
import { useChoreApi } from "../../../../shared/hooks/useApi/useChoreApi";
import Modal from "../../../../shared/components/Modal";

export default function NewChoreModal({ family, onClose, onChoreCreated }) {
  const { createNewChore } = useChoreApi();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedChildId, setAssignedChildId] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newChore = await createNewChore({
        title,
        description,
        value: Number(value),
        dueDate: dueDate || null,
        assignedChildId: assignedChildId,
        familyId: family.id,
      });
      onChoreCreated(newChore);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create chore");
    }
  };

  return (
    <Modal title="New Chore" onClose={onClose} ariaLabel="Create new chore modal">
      {error && (
        <p className="error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="chore-title">Title *</label>
          <input
            id="chore-title"
            type="text"
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chore-description">Description</label>
          <textarea
            id="chore-description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chore-value">Value *</label>
          <input
            id="chore-value"
            type="number"
            min="0"
            required
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chore-dueDate">Due Date</label>
          <input
            id="chore-dueDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="chore-assigned">Assign to *</label>
          <select
            id="chore-assigned"
            required
            value={assignedChildId}
            onChange={(e) => setAssignedChildId(e.target.value)}
            aria-label="Select child to assign chore"
          >
            <option value="">Select child...</option>
            {family.members
              .filter((m) => m.role === "CHILD")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName}
                </option>
              ))}
          </select>
        </div>

        <button type="submit">Create Chore</button>
      </form>
    </Modal>
  );
}