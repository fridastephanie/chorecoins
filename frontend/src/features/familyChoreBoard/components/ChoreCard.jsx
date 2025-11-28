export default function ChoreCard({ chore, currentUser, onSubmit, onViewHistory }) {
  const isChildAssigned = currentUser.role === "CHILD" && chore.assignedTo?.id === currentUser.id;
  const isParent = currentUser.role === "PARENT";

  return (
    <div className="chore-card">
      <h3>{chore.title}</h3>
      <p>{chore.description}</p>
      <p>Value: {chore.value}</p>
      <p>Assigned to: {chore.assignedTo?.firstName || "Unassigned"}</p>
      <p>Status: {chore.status}</p>

      <div className="chore-actions">
        {/* Childs "Submit" button for NOT_STARTED */}
        {isChildAssigned && chore.status === "NOT_STARTED" && (
          <button onClick={() => onSubmit(chore)}>Submit</button>
        )}

        {/* History button always visible */}
        <button onClick={() => onViewHistory(chore)}>History</button>
      </div>
    </div>
  );
}
