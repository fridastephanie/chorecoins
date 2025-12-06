import React, { useState } from "react";
import Modal from "../../../../shared/components/Modal";
import { useChoreApi } from "../../../../shared/hooks/useApi/useChoreApi";
import { useFileUpload } from "../../hooks/chore/useFileUpload";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { resizeImageFile } from "../../../../shared/utils/imageUtils";

export default function ChoreSubmissionModal({ chore, onClose, onSubmit }) {
  const { handleSubmitChoreAndReturnChore } = useChoreApi();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { files, previewUrls, handleFileChange, reset } = useFileUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resizedFiles = await Promise.all(files.map(file => resizeImageFile(file)));
      const updatedChore = await handleSubmitChoreAndReturnChore(chore.id, {
        commentChild: comment || null,
        files: resizedFiles,
      });
      onSubmit(updatedChore);
      reset();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit chore");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Submit Chore: ${chore?.title || ""}`} onClose={onClose} ariaLabel={`Submit chore ${chore?.title}`}>
      {error && <p className="error" role="alert">{error}</p>}

      <div className="input-group chore-submit">
        <form onSubmit={handleSubmit}>
          <label htmlFor="child-comment">Comment (optional)</label>
          <textarea
            id="child-comment"
            placeholder="Comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <label htmlFor="chore-files">Upload images (optional)</label>
          <input
            id="chore-files"
            type="file"
            accept=".jpeg,.jpg,.png,.webp"
            multiple
            onChange={handleFileChange}
          />

          <ImagePreviewGrid urls={previewUrls} />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
