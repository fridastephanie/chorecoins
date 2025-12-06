import { useEditUserForm } from "../hooks/useEditUserForm";

export default function useDeleteUser(user, onDeleteSuccess) {
  const { handleDelete } = useEditUserForm(user, onDeleteSuccess);

  /**
   * Deletes the given user by calling `handleDelete` from `useEditUserForm`.
   * Throws an error if deletion fails.
   */
  const deleteUser = async () => {
    try {
      await handleDelete();
    } catch (err) {
      throw err;
    }
  };

  return { deleteUser };
}
