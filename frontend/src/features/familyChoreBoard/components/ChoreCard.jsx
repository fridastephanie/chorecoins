export default function ChoreCard({
  chore,
  currentUser,
  onSubmit,
  onViewHistory,
  onDeleteChore,
}) {
  const isChildAssigned =
    currentUser.role === "CHILD" &&
    chore.assignedTo?.id === currentUser.id;

  const isParent = currentUser.role === "PARENT";

  return (
    <div className="chore-card">
      <h3>{chore.title}</h3>
      <p>{chore.description}</p>
      <p>Value: {chore.value}</p>
      <p>Assigned to: {chore.assignedTo?.firstName || "Unassigned"}</p>
      <p>Status: {chore.status}</p>

      <div className="chore-actions">

        {/* Child submit button */}
        {isChildAssigned && chore.status === "NOT_STARTED" && (
          <button onClick={() => onSubmit(chore)}>Submit</button>
        )}

        {/* Always visible */}
        <button onClick={() => onViewHistory(chore)}>History</button>

        {/* Parent-specific VIEW button on DONE */}
        {isParent && chore.status === "DONE" && (
          <button onClick={() => onViewHistory(chore)}>View</button>
        )}

        {/* Parent delete chore button */}
        {isParent && (
          <button
            className="danger"
            onClick={() => onDeleteChore(chore.id)}
          >
            Remove Chore
          </button>
        )}
      </div>
    </div>
  );
}
