import { useState } from "react";

export default function useConfirmModal() {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  /**
   * Opens the confirmation modal with a title, message, and onConfirm callback.
   * Automatically closes the modal after confirmation.
   */
  const openConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  /**
   * Closes the confirmation modal without triggering the onConfirm callback.
   */
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  return { confirmModal, openConfirmModal, closeConfirmModal };
}
