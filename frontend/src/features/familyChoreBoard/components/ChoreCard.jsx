export default function ChoreCard({
  chore,
  currentUser,
  onSubmit,
  onViewHistory,
  onDeleteChore,
  onViewSubmission,
}) {
  const isChildAssigned =
    currentUser.role === "CHILD" &&
    chore.assignedTo?.id === currentUser.id;

  const isParent = currentUser.role === "PARENT";
  const hasSubmissions = chore.submissions && chore.submissions.length > 0;
  const latestSubmission = hasSubmissions ? chore.submissions[chore.submissions.length - 1] : null;

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

        {/* History button only if there are submissions */}
        {hasSubmissions && (
          <button onClick={() => onViewHistory(chore)}>History</button>
        )}

        {/* Parent-specific VIEW button on DONE */}
        {isParent && chore.status === "DONE" && hasSubmissions && (
          // Send both chore and the latest submission to parent handler
          <button onClick={() => onViewSubmission({ chore, submission: latestSubmission })}>
            View
          </button>
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
