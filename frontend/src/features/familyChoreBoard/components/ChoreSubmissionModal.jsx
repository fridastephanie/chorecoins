import React, { useState } from "react";
import { useChoreApi } from "../../../shared/hooks/useChoreApi";
import Modal from "../../../shared/components/Modal";

export default function ChoreSubmissionModal({ chore, onClose, onSubmit }) {
  const { handleSubmitChoreAndReturnChore } = useChoreApi();
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedChore = await handleSubmitChoreAndReturnChore(chore.id, {
        commentChild: comment || null,
        imageUrls: imageUrl ? [imageUrl] : [],
        });
        onSubmit(updatedChore);
        onClose();
    } catch (err) {
        console.error(err.response?.data || err);
        setError(err.response?.data?.message || "Failed to submit chore");
    }
  };

  return (
    <Modal title={`Submit Chore: ${chore?.title || ""}`} onClose={onClose}>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}
