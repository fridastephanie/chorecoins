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
    return <Modal title="No submission found" onClose={onClose}><p>No submission available.</p></Modal>;
  }

  const handleApprove = () => {
    if (!comment.trim()) return setError("Comment is required.");
    onDecision("APPROVE", comment, latestSubmission);
    onClose();
  };

  const handleReject = () => {
    if (!comment.trim()) return setError("Comment is required.");
    onDecision("REJECT", comment, latestSubmission);
    onClose();
  };

  return (
    <Modal title={`Submission for ${chore?.title || "chore"}`} onClose={onClose}>
      {error && <p className="error">{error}</p>}

      <p><strong>Submitted at:</strong> {latestSubmission?.submittedAt ? new Date(latestSubmission.submittedAt).toLocaleString() : "Unknown"}</p>
      <p><strong>Child's message:</strong> {latestSubmission?.commentChild || "No message"}</p>

      <ImagePreviewGrid urls={latestSubmission?.imageUrls?.map(fn => imageUrlsMap[fn])} />

      <div>
        <label>
          Parent comment (required):
          <textarea value={comment} onChange={e => setComment(e.target.value)} required />
        </label>
      </div>

      <div className="modal-actions">
        <button onClick={handleApprove}>✅ Approve</button>
        <button className="danger" onClick={handleReject}>❌ Reject</button>
      </div>
    </Modal>
  );
}
