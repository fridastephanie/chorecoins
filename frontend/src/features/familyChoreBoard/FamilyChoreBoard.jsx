import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { useFamilyApi } from "../../shared/hooks/useFamilyApi";
import { useChoreApi } from "../../shared/hooks/useChoreApi";

import FamilyHeader from "./components/FamilyHeader";
import ChoreFilter from "./components/ChoreFilter";
import ChoreColumn from "./components/ChoreColumn";
import NewChoreModal from "./components/NewChoreModal";
import AddFamilyMemberModal from "./components/AddFamilyMemberModal";
import ChoreSubmissionModal from "./components/ChoreSubmissionModal";
import ChoreHistoryModal from "./components/ChoreHistoryModal";

export default function FamilyChoreBoard() {
  const { id: familyId } = useParams();
  const { user: currentUser } = useAuth();
  const { fetchFamilyApi } = useFamilyApi();
  const { fetchChoresForFamily, handleSubmitChoreAndReturnChore } = useChoreApi();
  const [family, setFamily] = useState(null);
  const [chores, setChores] = useState([]);
  const [filterChildId, setFilterChildId] = useState(null);
  const [newChoreModalOpen, setNewChoreModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);

  /**
   * Fetches family and chores data for the current family.
   * Runs whenever the familyId or currentUser changes.
   */
  useEffect(() => {
    if (!familyId || !currentUser) return;

    const loadFamilyAndChores = async () => {
      try {
        const familyData = await fetchFamilyApi(familyId);
        setFamily(familyData);

        const choresData = await fetchChoresForFamily(familyId);
        setChores(choresData);
      } catch (err) {
        console.error(err);
      }
    };

    loadFamilyAndChores();
  }, [familyId, currentUser, fetchFamilyApi, fetchChoresForFamily]);

  // Filters chores by the selected child if any filter is applied.
  const filteredChores = filterChildId
    ? chores.filter((c) => c.assignedTo?.id === filterChildId)
    : chores;

  // Columns for displaying chore status.
  const columns = [
    { status: "NOT_STARTED", title: "Not Started" },
    { status: "DONE", title: "Submitted" },
    { status: "APPROVED", title: "Approved" },
  ];

  if (!currentUser) return <p>Loading user...</p>;

  return (
    <div className="family-choreboard">
      {family && currentUser && (
        <FamilyHeader
          family={family}
          currentUser={currentUser}
          onAddChore={() => setNewChoreModalOpen(true)}
          onAddMember={() => setAddMemberModalOpen(true)}
        />
      )}

      <ChoreFilter
        childrenList={family?.members?.filter(m => m.role === "CHILD") || []}
        filterChildId={filterChildId}
        setFilterChildId={(val) => setFilterChildId(val ? Number(val) : null)}
      />

      {columns.map((col) => (
        <ChoreColumn
          key={col.status}
          column={col}
          chores={filteredChores.filter((c) => c.status === col.status)}
          currentUser={currentUser}
          onSubmit={(chore) => setSubmissionModalData(chore)}
          onViewHistory={(chore) => setHistoryModalData(chore)}
        />
      ))}

      {/* Modal for creating a new chore */}
      {newChoreModalOpen && (
        <NewChoreModal
          family={family}
          onClose={() => setNewChoreModalOpen(false)}
          onChoreCreated={(newChore) => setChores((prev) => [...prev, newChore])}
        />
      )}

      {/* Modal for adding a new family member */}
      {addMemberModalOpen && (
        <AddFamilyMemberModal
          family={family}
          onClose={() => setAddMemberModalOpen(false)}
          onMemberAdded={(newMember) =>
            setFamily((prev) => ({ ...prev, members: [...prev.members, newMember] }))
          }
        />
      )}

      {/* Modal for submitting a chore */}
      {submissionModalData && (
        <ChoreSubmissionModal
          chore={submissionModalData}
          onClose={() => setSubmissionModalData(null)}
          onSubmit={async (payload) => {
            const updatedChore = await handleSubmitChoreAndReturnChore(submissionModalData.id, payload);
            setChores((prev) =>
              prev.map((c) => (c.id === updatedChore.id ? updatedChore : c))
            );
            setSubmissionModalData(null);
          }}
        />
      )}

      {/* Modal for viewing chore history */}
      {historyModalData && (
        <ChoreHistoryModal
          chore={historyModalData}
          onClose={() => setHistoryModalData(null)}
        />
      )}
    </div>
  );
}