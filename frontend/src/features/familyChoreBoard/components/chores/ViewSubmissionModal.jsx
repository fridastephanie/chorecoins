import { useState } from "react";
import Modal from "../../../../shared/components/Modal";

export default function ViewSubmissionModal({ chore, submission, onClose, onDecision }) {

  const latestSubmission = submission ?? chore?.submissions?.[chore.submissions?.length - 1];
  const [comment, setComment] = useState(""); 
  const [error, setError] = useState(null);   

  const handleApprove = () => {
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }
    onDecision("APPROVE", comment, latestSubmission);
    onClose();
  };

  const handleReject = () => {
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }
    onDecision("REJECT", comment, latestSubmission);
    onClose();
  };

  if (!latestSubmission) {
    return (
      <Modal title="No submission found" onClose={onClose}>
        <p>No submission available for this chore.</p>
      </Modal>
    );
  }

  return (
    <Modal title={`Submission for ${chore?.title || "chore"}`} onClose={onClose}>
      {error && <p className="error">{error}</p>}

      <div>
        <p>
          <strong>Submitted at:</strong>{" "}
          {latestSubmission?.submittedAt
            ? new Date(latestSubmission.submittedAt).toLocaleString()
            : "Unknown"}
        </p>
        <p>
          <strong>Childs message:</strong>{" "}
          {latestSubmission?.commentChild || "No message"}
        </p>
      </div>

      <div>
        <label>
          Parent comment (required):
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="modal-actions">
        <button onClick={handleApprove}>✅ Approve</button>
        <button className="danger" onClick={handleReject}>❌ Reject</button>
      </div>
    </Modal>
  );
}
