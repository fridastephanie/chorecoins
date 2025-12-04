import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Modal from "../../../shared/components/Modal";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { useError } from "../../../shared/context/ErrorContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { useEditUserForm } from "../hooks/useEditUserForm";

export default function EditUserForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");

  // Initialize the edit user form hook and provide a callback to handle post-deletion actions
  const { values, errors, handleChange, isValid, handleUpdate, handleDelete, loading } =
    useEditUserForm(user, () => {
      logout();
      navigate("/login", { replace: true });
    });

  /**
   * Handles form submission for updating user data.
   * Validates input and calls handleUpdate from the hook.
   * Shows modal with success or no-change message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!isValid()) {
      showError("Please fix the errors before submitting");
      return;
    }

    try {
      const res = await handleUpdate();
      if (res) setMessageModalContent("User updated successfully!");
      else setMessageModalContent("No changes to update.");
      setShowMessageModal(true);
    } catch (err) {
      showError(err);
    }
  };

  /**
   * Opens the delete confirmation modal.
   */
  const handleDeleteClick = () => setShowDeleteModal(true);

  /**
   * Confirms account deletion.
   * Calls handleDelete from the hook and closes the modal.
   * onDeleteSuccess callback will handle logout & redirect.
   */
  const confirmDelete = async () => {
    try {
      await handleDelete();
    } catch (err) {
      showError(err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Name"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="Your name"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Your email"
        />
        <InputField
            label="New Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password} 
            placeholder="Leave empty if unchanged"
        />
        <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword} 
            placeholder="Confirm new password"
        />
        <div className="edit-user-buttons">
            <button type="submit" disabled={loading}>Update User</button>
            <button type="button" onClick={handleDeleteClick} disabled={loading} className="delete-btn">Delete Account</button>
        </div>
      </form>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete your account? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Yes, Delete"
          cancelText="Cancel"
       />
      )}

      {/* Success / info modal */}
      {showMessageModal && (
        <Modal
          title="Information"
          onClose={() => setShowMessageModal(false)}
        >
          <p>{messageModalContent}</p>
          <button onClick={() => setShowMessageModal(false)}>OK</button>
        </Modal>
      )}
    </>
  );
}