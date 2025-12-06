export default function ChoreActions({
  chore,
  currentUser,
  onSubmit,
  onViewHistory,
  onDeleteChore,
  onViewSubmission,
}) {    
  const isChildAssigned =
    currentUser.role === "CHILD" && chore.assignedTo?.id === currentUser.id;
  const isParent = currentUser.role === "PARENT";

  const hasSubmissions = chore.submissions?.length > 0;
  const latestSubmission = hasSubmissions
    ? chore.submissions[chore.submissions.length - 1]
    : null;

  return (
    <div className="chore-actions">
      {hasSubmissions && <button onClick={() => onViewHistory(chore)}>History</button>}

      {isParent && (
        <button className="remove-btn" onClick={() => onDeleteChore(chore.id)}>
          Remove
        </button>
      )}

      {isParent && chore.status === "DONE" && hasSubmissions && (
        <button onClick={() => onViewSubmission({ chore, submission: latestSubmission })}>
          View
        </button>
      )}

      {isChildAssigned && chore.status === "NOT_STARTED" && (
        <button onClick={() => onSubmit(chore)}>Submit</button>
      )}
    </div>
  );
}
