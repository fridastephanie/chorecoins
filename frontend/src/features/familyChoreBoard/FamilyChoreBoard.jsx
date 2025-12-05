import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { useError } from "../../shared/context/ErrorContext";
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
import { FamilyProvider } from "../../shared/context/FamilyContext";
import "../../css/features/familyChoreBoard.css";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

export default function FamilyChoreBoard() {
  useDocumentTitle("Family Chore Board");  
  const { id: familyId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showError } = useError();
  const { removeFamily } = useFamilies(currentUser?.id);
  const { removeFamilyMemberApi, deleteFamilyApi } = useFamilyApi();
  const { handleDeleteChore, approveChoreSubmission, rejectChoreSubmission } = useChoreApi();
  const { family, chores, loading, reload } = useFamilyChores(familyId, currentUser);
  const [filterChildId, setFilterChildId] = useState(null);

  const [newChoreModalOpen, setNewChoreModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);
  const [viewSubmissionData, setViewSubmissionData] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

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

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p>Loading family data...</p>;

  const filteredChores = filterChildId
    ? chores.filter((c) => c.assignedTo?.id === filterChildId)
    : chores;

  const columns = [
    { status: "NOT_STARTED", title: "Not Started" },
    { status: "DONE", title: "Submitted" },
    { status: "APPROVED", title: "Approved" },
  ];

  const handleRemoveMember = (memberId) => {
    const member = family.members.find((m) => m.id === memberId);
      if (!member) return;

      const isLastParent =
        member.role === "PARENT" &&
        family.members.filter((m) => m.role === "PARENT").length === 1;

      if (member.id === currentUser.id && !isLastParent) {
        showError("You cannot remove yourself while there is another parent in the family.");
        return;
      }

      openConfirmModal({
        title: "Remove Family Member?",
        message: "Are you sure you want to remove this member?",
        onConfirm: async () => {
        try {
            if (isLastParent) {
            await deleteFamilyApi(familyId);
            removeFamily(Number(familyId));
            navigate("/dashboard", { replace: true });
            } else {
            await removeFamilyMemberApi(familyId, member.id);
            await reload();

            if (member.id === currentUser.id) navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error("Failed to remove member:", err);
         }
       },
    });
};

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
        <FamilyProvider>
           <FamilyHeader
            family={family}
            currentUser={currentUser}
            onAddChore={() => setNewChoreModalOpen(true)}
            onAddMember={() => setAddMemberModalOpen(true)}
            onRemoveMember={handleRemoveMember}
            onDeleteFamily={handleDeleteFamily}
            navigate={navigate} 
           />
        </FamilyProvider>
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
