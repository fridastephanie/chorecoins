import { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import { useFetchImages } from "../../hooks/chore/useFetchImages";
import { ImagePreviewGrid } from "./ImagePreviewGrid";

export default function ViewSubmissionModal({ chore, submission, onClose, onDecision }) {
  const latestSubmission = submission ?? chore?.submissions?.[chore.submissions?.length - 1];
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const { imageUrlsMap } = useFetchImages(latestSubmission?.imageUrls);

  if (!latestSubmission) {
    return (
      <Modal title="No submission found" onClose={onClose} ariaLabel="No submission available">
        <p aria-live="polite">No submission available.</p>
      </Modal>
    );
  }

  const handleDecision = (decision) => {
    if (!comment.trim()) return setError("Comment is required.");
    onDecision(decision, comment, latestSubmission);
    onClose();
  };

  return (
    <Modal title={`Submission for ${chore?.title || "chore"}`} onClose={onClose} ariaLabel={`Submission details for ${chore?.title}`}>
      {error && <p className="error" role="alert">{error}</p>}

      <p><strong>Submitted at:</strong> {latestSubmission?.submittedAt ? new Date(latestSubmission.submittedAt).toLocaleString() : "Unknown"}</p>
      <p><strong>Child's message:</strong> {latestSubmission?.commentChild || "No message"}</p>

      <ImagePreviewGrid urls={latestSubmission?.imageUrls?.map(fn => imageUrlsMap[fn])} />

      <div className="input-group">
        <label htmlFor="parent-comment">Parent comment (required):</label>
        <textarea
          id="parent-comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />
      </div>

      <div className="modal-actions">
        <button onClick={() => handleDecision("APPROVE")}>✅ Approve</button>
        <button className="danger" onClick={() => handleDecision("REJECT")}>❌ Reject</button>
      </div>
    </Modal>
  );
}
