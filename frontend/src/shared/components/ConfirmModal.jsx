import Modal from "./Modal";

export default function ConfirmModal({ 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  onConfirm, 
  onCancel, 
  confirmText = "Yes", 
  cancelText = "Cancel" 
}) {
  return (
    <Modal title={title} onClose={onCancel} ariaLabel={title}>
      <p>{message}</p>
      <div className="confirm-modal-buttons" role="group" aria-label="Confirmation actions">
        <button 
          type="button" 
          onClick={onConfirm} 
          className="delete-btn"
          aria-label={confirmText}
        >
          {confirmText}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          aria-label={cancelText}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
}