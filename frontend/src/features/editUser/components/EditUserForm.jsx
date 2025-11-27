import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Modal from "../../../shared/components/modal/Modal";
import { useError } from "../../../shared/context/ErrorContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { useEditUserForm } from "../hooks/useEditUserForm";

export default function EditUserForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Initialize the edit user form hook and provide a callback to handle post-deletion actions,
  // such as logging out the user and redirecting to the login page.
  const { values, errors, handleChange, isValid, handleUpdate, handleDelete, loading } =
    useEditUserForm(user, () => {
      logout();
      navigate("/login", { replace: true });
    });

  /**
   * Handles form submission for updating user data.
   * Validates input and calls handleUpdate from the hook.
   * Alerts user on success or if no changes were made.
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
      if (res) alert("User updated successfully!");
      else alert("No changes to update.");
    } catch (err) {
      showError(err);
    }
  };

  /**
   * Opens the delete confirmation modal.
   */
  const handleDeleteClick = () => setShowModal(true);

  /**
   * Confirms account deletion.
   * Calls handleDelete from the hook and closes the modal.
   * Any errors are shown using the error context.
   * onDeleteSuccess callback will handle logout & redirect.
   */
  const confirmDelete = async () => {
    try {
      await handleDelete();
    } catch (err) {
      showError(err);
    } finally {
      setShowModal(false);
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
          error={errors.password && Array.isArray(errors.password) ? errors.password.join(", ") : errors.password}
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

        <button type="submit" disabled={loading}>Update User</button>
        <button
          type="button"
          onClick={handleDeleteClick}
          style={{ marginLeft: "10px", color: "red" }}
          disabled={loading}
        >
          Delete Account
        </button>
      </form>

      {showModal && (
        <Modal
          title="Confirm Delete"
          onClose={() => setShowModal(false)}
        >
          <p>Are you sure you want to delete your account? This cannot be undone.</p>
          <button onClick={confirmDelete} style={{ marginRight: "10px", color: "red" }}>Yes, Delete</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </Modal>
      )}
    </>
  );
}