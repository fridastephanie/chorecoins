import { useMemo } from "react";
import Modal from "../../../../shared/components/Modal";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { useFetchImages } from "../../hooks/chore/useFetchImages";

export default function ChoreHistoryModal({ chore, onClose }) {
  const sortedSubmissions = useMemo(
    () => [...(chore.submissions || [])].sort((a, b) => a.id - b.id),
    [chore.submissions]
  );
  return (
    <Modal
      title={`History for: ${chore.title}`}
      onClose={onClose}
      ariaLabel={`Chore history for ${chore.title}`}
    >
      {sortedSubmissions.length === 0 && <p aria-live="polite">No submissions yet.</p>}

      {sortedSubmissions.map((sub) => {
        const { imageUrlsMap } = useFetchImages(sub.imageUrls);

        return (
          <section key={sub.id} className="submission-history" aria-labelledby={`submission-${sub.id}-title`}>            

            <ImagePreviewGrid urls={sub.imageUrls?.map(fn => imageUrlsMap[fn])} />

            <p><strong>Child comment:</strong> {sub.commentChild || "-"}</p>
            <p><strong>Parent comment:</strong> {sub.commentParent || "-"}</p>
            <p><strong>Status:</strong> {sub.approvedByParent ? "Approved" : "Not Approved"}</p>
            <hr />
          </section>
        );
      })}
    </Modal>
  );
}
