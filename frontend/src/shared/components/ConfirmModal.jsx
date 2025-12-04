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
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="confirm-modal-buttons">
        <button type="button" onClick={onConfirm} className="delete-btn">{confirmText}</button>
        <button type="button" onClick={onCancel}>{cancelText}</button>
      </div>
    </Modal>
  );
}