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

  const formattedDueDate = chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : null;

  return (
    <div className="chore-card">
        <h3>{chore.title}</h3>
        <p>{chore.description}</p>
        <p>
            <strong>Value:</strong> {chore.value}
        </p>
        <p>
            <strong>Assigned to:</strong> {chore.assignedTo?.firstName || "Unassigned"}
        </p>
        <p>
            <strong>Status:</strong> {chore.status}
        </p>


      {/* Show dueDate only if status is NOT_STARTED */}
      {chore.status === "NOT_STARTED" && formattedDueDate && (
        <p>
            <strong>Due Date:</strong> {formattedDueDate}
        </p>
      )}

      <div className="chore-actions">

        {/* History button only if there are submissions */}
        {hasSubmissions && (
          <button onClick={() => onViewHistory(chore)}>History</button>
        )}

        {/* Parent delete chore button */}
        {isParent && (
          <button
            className="remove-btn"
            onClick={() => onDeleteChore(chore.id)}
          >
            Remove
          </button>
          
        )}

        {/* Parent-specific VIEW button on DONE */}
        {isParent && chore.status === "DONE" && hasSubmissions && (
          // Send both chore and the latest submission to parent handler
          <button onClick={() => onViewSubmission({ chore, submission: latestSubmission })}>
            View
          </button>
        )}
        
        {/* Child submit button */}
        {isChildAssigned && chore.status === "NOT_STARTED" && (
          <button onClick={() => onSubmit(chore)}>Submit</button>
        )}

      </div>
    </div>
  );
}
