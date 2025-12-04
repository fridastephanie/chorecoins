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
import ViewSubmissionModal from "./components/ViewSubmissionModal";
import ConfirmModal from "../../shared/components/ConfirmModal";
import "../../css/features/familyChoreBoard.css";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

export default function FamilyChoreBoard() {
  useDocumentTitle("Family Chore Board");  
  const { id: familyId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { removeFamily } = useFamilies(currentUser?.id);
  const { removeFamilyMemberApi, deleteFamilyApi } = useFamilyApi();
  const { handleDeleteChore, approveChoreSubmission, rejectChoreSubmission } = useChoreApi();
  const { family, chores, loading, reload } = useFamilyChores(familyId, currentUser);
  const [filterChildId, setFilterChildId] = useState(null);

  // Modal visibility states
  const [newChoreModalOpen, setNewChoreModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);
  const [viewSubmissionData, setViewSubmissionData] = useState(null);

  // ConfirmModal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  /**
   * Opens the confirm modal with custom title, message, and callback.
   * The `onConfirm` callback is executed only if the user confirms.
   */
  const openConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal({ ...confirmModal, isOpen: false });
      },
    });
  };

  /** Closes the confirm modal without executing the action */
  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

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
   * Removes a member from the family.
   * Opens a confirm modal before calling the API.
   */
  const handleRemoveMember = (memberId) => {
    openConfirmModal({
      title: "Remove Family Member?",
      message: "Are you sure you want to remove this member?",
      onConfirm: async () => {
        await removeFamilyMemberApi(familyId, memberId);
        await reload(); 
      },
    });
  };

  /**
   * Deletes the entire family and updates the dashboard.
   * Opens a confirm modal before calling the API.
   */
  const handleDeleteFamily = () => {
    openConfirmModal({
      title: "Delete Family?",
      message: "Are you sure you want to delete this family? This action cannot be undone.",
      onConfirm: async () => {
        await deleteFamilyApi(familyId);
        removeFamily(Number(familyId));
        navigate("/dashboard");
      },
    });
  };

  /**
   * Deletes a chore and reloads family chores.
   * Opens a confirm modal before calling the API.
   */
  const handleDeleteChoreLocal = (choreId) => {
    openConfirmModal({
      title: "Delete Chore?",
      message: "Are you sure you want to delete this chore?",
      onConfirm: async () => {
        await handleDeleteChore(choreId);
        await reload();
      },
    });
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
      <div className="choreboard-wrapper">
        <div className="family-choreboard-columns">
          {columns.map((col) => (
            <ChoreColumn
              key={col.status}
              column={col}
              chores={filteredChores.filter((c) => c.status === col.status)}
              currentUser={currentUser}
              onSubmit={(chore) => setSubmissionModalData(chore)}
              onViewHistory={(chore) => setHistoryModalData(chore)}
              onDeleteChore={handleDeleteChoreLocal}
              onViewSubmission={(data) => setViewSubmissionData(data)}
            />
          ))}
        </div>
      </div>  

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

      {/* ViewSubmissionModal for parent to approve/reject latest submission */}
      {viewSubmissionData && (
        <ViewSubmissionModal
          chore={viewSubmissionData.chore}
          submission={viewSubmissionData.submission}
          onClose={() => setViewSubmissionData(null)}
          onDecision={async (decision, comment, submission) => {
            try {
              if (decision === "APPROVE") {
                await approveChoreSubmission(viewSubmissionData.chore.id, submission.id, comment);
              } else if (decision === "REJECT") {
                await rejectChoreSubmission(viewSubmissionData.chore.id, submission.id, comment);
              }
              await reload();
            } catch (err) {
              console.error("Error updating submission:", err);
            } finally {
              setViewSubmissionData(null);
            }
          }}
        />
      )}

      {/* ConfirmModal: used for delete confirmations (family, member, chore) */}
      {confirmModal.isOpen && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirmModal}
          confirmText="Yes"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
