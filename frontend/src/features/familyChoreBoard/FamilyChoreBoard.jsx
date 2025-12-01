import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { useFamilyApi } from "../../shared/hooks/useFamilyApi";
import { useChoreApi } from "../../shared/hooks/useChoreApi";
import useFamilies from "../dashboard/hooks/useFamilies";
import { useFamilyChores } from "./hooks/useFamilyChores";

import FamilyHeader from "./components/FamilyHeader";
import ChoreFilter from "./components/ChoreFilter";
import ChoreColumn from "./components/ChoreColumn";
import NewChoreModal from "./components/NewChoreModal";
import AddFamilyMemberModal from "./components/AddFamilyMemberModal";
import ChoreSubmissionModal from "./components/ChoreSubmissionModal";
import ChoreHistoryModal from "./components/ChoreHistoryModal";

export default function FamilyChoreBoard() {
  /**
   * Retrieves the family ID from the current route parameters.
   */
  const { id: familyId } = useParams();

  /**
   * Hook for programmatic navigation between routes.
   */
  const navigate = useNavigate();

  /**
   * Retrieves the currently logged-in user from context.
   */
  const { user: currentUser } = useAuth();

  /**
   * Custom hook for updating family list in dashboard.
   */
  const { removeFamily } = useFamilies(currentUser?.id);

  const { removeFamilyMemberApi, deleteFamilyApi } = useFamilyApi();
  const { handleSubmitChoreAndReturnChore, handleDeleteChore } = useChoreApi();

  /**
   * Custom hook to fetch family details and chores.
   * Provides `family` object, `chores` array, `loading` state, and `reload` function.
   */
  const { family, chores, loading, reload } = useFamilyChores(familyId, currentUser);

  // State for filtering chores by child
  const [filterChildId, setFilterChildId] = useState(null);

  // Modal visibility states
  const [newChoreModalOpen, setNewChoreModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p>Loading family data...</p>;

  /**
   * Returns the list of chores, optionally filtered by selected child.
   */
  const filteredChores = filterChildId
    ? chores.filter((c) => c.assignedTo?.id === filterChildId)
    : chores;

  const columns = [
    { status: "NOT_STARTED", title: "Not Started" },
    { status: "DONE", title: "Submitted" },
    { status: "APPROVED", title: "Approved" },
  ];

  /**
   * Removes a member from the family and reloads the family and chore data.
   */
  const handleRemoveMember = async (memberId) => {
    await removeFamilyMemberApi(familyId, memberId);
    await reload(); 
  };

  /**
   * Deletes the entire family and updates the dashboard.
   */
  const handleDeleteFamily = async () => {
    await deleteFamilyApi(familyId);
    removeFamily(Number(familyId));
    navigate("/dashboard");
  };

  /**
   * Deletes a chore and reloads family chores.
   */
  const handleDeleteChoreLocal = async (choreId) => {
    await handleDeleteChore(choreId);
    await reload();
  };

  return (
    <div className="family-choreboard">

      {/* Family header with actions */}
      {family && (
        <FamilyHeader
          family={family}
          currentUser={currentUser}
          onAddChore={() => setNewChoreModalOpen(true)}
          onAddMember={() => setAddMemberModalOpen(true)}
          onRemoveMember={handleRemoveMember}
          onDeleteFamily={handleDeleteFamily}
        />
      )}

      {/* Filter chores by child */}
      <ChoreFilter
        childrenList={family?.members?.filter((m) => m.role === "CHILD") || []}
        filterChildId={filterChildId}
        setFilterChildId={(val) => setFilterChildId(val ? Number(val) : null)}
      />

      {/* Chore columns by status */}
      {columns.map((col) => (
        <ChoreColumn
          key={col.status}
          column={col}
          chores={filteredChores.filter((c) => c.status === col.status)}
          currentUser={currentUser}
          onSubmit={(chore) => setSubmissionModalData(chore)}
          onViewHistory={(chore) => setHistoryModalData(chore)}
          onDeleteChore={handleDeleteChoreLocal}
        />
      ))}

      {/* Modals */}
      {newChoreModalOpen && (
        <NewChoreModal
          family={family}
          onClose={() => setNewChoreModalOpen(false)}
          onChoreCreated={async () => await reload()}
        />
      )}

      {addMemberModalOpen && (
        <AddFamilyMemberModal
          family={family}
          onClose={() => setAddMemberModalOpen(false)}
          onMemberAdded={async () => await reload()}
        />
      )}

      {submissionModalData && (
        <ChoreSubmissionModal
          chore={submissionModalData}
          onClose={() => setSubmissionModalData(null)}
          onSubmit={async () => await reload()}
        />
      )}

      {historyModalData && (
        <ChoreHistoryModal
          chore={historyModalData}
          onClose={() => setHistoryModalData(null)}
        />
      )}
    </div>
  );
}