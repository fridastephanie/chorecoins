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
    <Modal title={`History for: ${chore.title}`} onClose={onClose}>
      {sortedSubmissions.map((sub) => {
        const { imageUrlsMap } = useFetchImages(sub.imageUrls);

        return (
          <div key={sub.id} className="submission-history">
            <p><strong>Child comment:</strong> {sub.commentChild || "—"}</p>
            <ImagePreviewGrid urls={sub.imageUrls?.map(fn => imageUrlsMap[fn])} />
            <p><strong>Parent comment:</strong> {sub.commentParent || "—"}</p>
            <p>Status: {sub.approvedByParent ? "Approved" : "Not Approved"}</p>
            <hr />
          </div>
        );
      })}
    </Modal>
  );
}
