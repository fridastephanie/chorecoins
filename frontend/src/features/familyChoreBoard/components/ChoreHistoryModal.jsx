import Modal from "../../../shared/components/modal/Modal";

export default function ChoreHistoryModal({ chore, onClose }) {
  const sortedSubmissions = [...(chore.submissions || [])].sort(
    (a, b) => a.id - b.id
  );

  return (
    <Modal title={`History for: ${chore.title}`} onClose={onClose}>
      {sortedSubmissions.map((sub) => (
        <div key={sub.id} className="submission-history">
          <p><strong>Child comment:</strong> {sub.commentChild || "—"}</p>
          {sub.imageUrls?.length > 0 && (
            <div>
              {sub.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`submission ${i}`} />
              ))}
            </div>
          )}
          <p><strong>Parent comment:</strong> {sub.commentParent || "—"}</p>
          <p>Status: {sub.approvedByParent ? "Approved" : "Not Approved"}</p>
        </div>
      ))}
    </Modal>
  );
}
