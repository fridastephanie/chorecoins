import EditUserForm from "./components/EditUserForm";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";
import "../../css/features/editUser.css";

export default function EditUser() {
  useDocumentTitle("Edit User");
  return (
    <main className="edit-user-container" aria-labelledby="edit-user-heading">
      <h2 id="edit-user-heading">Edit User</h2>
      <EditUserForm />
    </main>
  );
}