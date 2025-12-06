import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Modal from "../../../shared/components/Modal";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { useError } from "../../../shared/context/ErrorContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { useEditUserForm } from "../hooks/useEditUserForm";
import useModal from "../hooks/useModal";
import useDeleteUser from "../hooks/useDeleteUser";
import { getFirstValidationError } from "../../../shared/utils/getFirstValidationError";

export default function EditUserForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const { user, logout } = useAuth();

  const deleteModal = useModal();
  const messageModal = useModal();
  const [messageModalContent, setMessageModalContent] = useState("");

  const { values, errors, handleChange, isValid, handleUpdate, loading } =
    useEditUserForm(user, () => {
      logout();
      navigate("/login", { replace: true });
    });

  const { deleteUser } = useDeleteUser(user, () => {
    logout();
    navigate("/login", { replace: true });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!isValid()) {
      const msg = getFirstValidationError(errors);
      showError(msg || "Please fix the errors before submitting");
      return;
    }

    try {
      const res = await handleUpdate();
      setMessageModalContent(res ? "User updated successfully!" : "No changes to update.");
      messageModal.open();
    } catch (err) {
      showError(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser();
    } catch (err) {
      showError(err);
    } finally {
      deleteModal.close();
    }
  };

  if (!user) return null;

  const fields = [
    { name: "firstName", label: "Name", placeholder: "Your name", type: "text" },
    { name: "email", label: "Email", placeholder: "Your email", type: "email" },
    { name: "password", label: "New Password", placeholder: "Leave empty if unchanged", type: "password" },
    { name: "confirmPassword", label: "Confirm New Password", placeholder: "Confirm new password", type: "password" },
  ];

  return (
    <>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <InputField
            key={field.name}
            {...field}
            value={values[field.name]}
            onChange={handleChange}
            error={errors[field.name]}
          />
        ))}

        <div className="edit-user-buttons">
          <button type="submit" disabled={loading}>Update User</button>
          <button
            type="button"
            onClick={deleteModal.open}
            disabled={loading}
            className="delete-btn"
          >
            ❌ Delete Account
          </button>
        </div>
      </form>

      {/* Modals */}
      {deleteModal.isOpen && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete your account? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={deleteModal.close}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}

      {messageModal.isOpen && (
        <Modal title="Information" onClose={messageModal.close}>
          <p>{messageModalContent}</p>
          <button onClick={messageModal.close}>OK</button>
        </Modal>
      )}
    </>
  );
}