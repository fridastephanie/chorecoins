import EditUserForm from "./components/EditUserForm";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";
import "../../css/features/editUser.css";

export default function EditUser() {
  useDocumentTitle("Edit User");
  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <EditUserForm />
    </div>
  );
}