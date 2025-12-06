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
    <Modal title="New Chore" onClose={onClose}>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          required
          type="number"
          min="0"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          required
          value={assignedChildId}
          onChange={(e) => setAssignedChildId((e.target.value))}
        >
          <option value="">Assign to ..</option>
          {family.members
            .filter((m) => m.role === "CHILD")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName}
              </option>
            ))}
        </select>
        <button type="submit">Create Chore</button>
      </form>
    </Modal>
  );
}
