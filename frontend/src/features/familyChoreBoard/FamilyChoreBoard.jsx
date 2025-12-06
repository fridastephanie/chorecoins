import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import useFamilies from "../dashboard/hooks/useFamilies";
import { useFamilyChores } from "./hooks/useFamilyChores";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

import useConfirmModal from "./hooks/useConfirmModal";
import useFamilyBoardActions from "./hooks/useFamilyBoardActions";

import FamilyHeader from "./components/family/FamilyHeader";
import ChoreFilter from "./components/chores/ChoreFilter";
import ChoreColumn from "./components/chores/ChoreColumn";
import NewChoreModal from "./components/chores/NewChoreModal";
import AddFamilyMemberModal from "./components/family/AddFamilyMemberModal";
import ChoreSubmissionModal from "./components/chores/ChoreSubmissionModal";
import ChoreHistoryModal from "./components/chores/ChoreHistoryModal";
import ViewSubmissionModal from "./components/chores/ViewSubmissionModal";
import ConfirmModal from "../../shared/components/ConfirmModal";
import { FamilyProvider } from "../../shared/context/FamilyContext";
import "../../css/features/familyChoreBoard.css";
import familyImage from "../../assets/family_outside.png";

export default function FamilyChoreBoard() {
  useDocumentTitle("Family Chore Board");
  const { id: familyId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { removeFamily } = useFamilies(currentUser?.id);
  const { family, chores, loading, reload } = useFamilyChores(familyId, currentUser);

  const [filterChildId, setFilterChildId] = useState(null);
  const [newChoreModalOpen, setNewChoreModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);
  const [viewSubmissionData, setViewSubmissionData] = useState(null);

  const { confirmModal, openConfirmModal, closeConfirmModal } = useConfirmModal();
  const { handleRemoveMember, handleDeleteFamily, handleDeleteChoreLocal, approveChoreSubmission, rejectChoreSubmission } =
    useFamilyBoardActions(familyId, currentUser, reload, removeFamily, navigate, openConfirmModal);

  if (!currentUser) return <p aria-live="polite">Loading user...</p>;
  if (loading) return <p aria-live="polite">Loading family data...</p>;

  const filteredChores = filterChildId
    ? chores.filter((c) => c.assignedTo?.id === filterChildId)
    : chores;

  const columns = [
    { status: "NOT_STARTED", title: "Not Started" },
    { status: "DONE", title: "Submitted" },
    { status: "APPROVED", title: "Approved" },
  ];

  return (
    <main className="family-choreboard">
      <FamilyProvider>
        <header>
          <FamilyHeader
            family={family}
            currentUser={currentUser}
            onAddChore={() => setNewChoreModalOpen(true)}
            onAddMember={() => setAddMemberModalOpen(true)}
            onRemoveMember={(id) => handleRemoveMember(family.members.find(m => m.id === id), family.members)}
            onDeleteFamily={handleDeleteFamily}
            navigate={navigate}
          />
        </header>
      </FamilyProvider>

      <img
        src={familyImage}
        alt="Family doing chores outside home"
        className="family-image"
      />

      <section className="family-main-right" aria-label="Chore Board">
        <ChoreFilter
          childrenList={family?.members?.filter((m) => m.role === "CHILD") || []}
          filterChildId={filterChildId}
          setFilterChildId={(val) => setFilterChildId(val ? Number(val) : null)}
          aria-label="Filter chores by child"
        />

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
                aria-label={`${col.title} column`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {newChoreModalOpen && (
        <NewChoreModal
          family={family}
          onClose={() => setNewChoreModalOpen(false)}
          onChoreCreated={reload}
          aria-label="Add new chore modal"
        />
      )}

      {addMemberModalOpen && (
        <AddFamilyMemberModal
          family={family}
          onClose={() => setAddMemberModalOpen(false)}
          onMemberAdded={reload}
          aria-label="Add family member modal"
        />
      )}

      {submissionModalData && (
        <ChoreSubmissionModal
          chore={submissionModalData}
          onClose={() => setSubmissionModalData(null)}
          onSubmit={reload}
          aria-label="Submit chore modal"
        />
      )}

      {historyModalData && (
        <ChoreHistoryModal
          chore={historyModalData}
          onClose={() => setHistoryModalData(null)}
          aria-label="Chore history modal"
        />
      )}

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
          aria-label="View chore submission modal"
        />
      )}

      {confirmModal.isOpen && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirmModal}
          confirmText="Yes"
          cancelText="Cancel"
          aria-label="Confirmation modal"
        />
      )}
    </main>
  );
}
