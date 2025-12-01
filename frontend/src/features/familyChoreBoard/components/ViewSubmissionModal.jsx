import { useState } from "react";
import Modal from "../../../shared/components/modal/Modal";

export default function ViewSubmissionModal({ chore, submission, onClose, onDecision }) {

  const latestSubmission = submission ?? chore?.submissions?.[chore.submissions?.length - 1];
  const [comment, setComment] = useState(""); 
  const [error, setError] = useState(null);   

  /**
   * Handles approving the submission.
   * Requires a non-empty comment.
   */
  const handleApprove = () => {
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }
    onDecision("APPROVE", comment, latestSubmission);
    onClose();
  };

  /**
   * Handles rejecting the submission.
   * Requires a non-empty comment.
   */
  const handleReject = () => {
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }
    onDecision("REJECT", comment, latestSubmission);
    onClose();
  };

  // If no submission is available, show a message in a modal
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

      {/* Display submission details */}
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

      {/* Input for parent comment */}
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

      {/* Action buttons */}
      <div className="modal-actions">
        <button onClick={handleApprove}>Approve</button>
        <button className="danger" onClick={handleReject}>Reject</button>
      </div>
    </Modal>
  );
}
