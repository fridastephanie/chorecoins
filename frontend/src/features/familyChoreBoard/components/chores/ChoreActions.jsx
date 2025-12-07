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
    ? [...chore.submissions].sort((a, b) => a.id - b.id).pop()
    : null;

  return (
    <div className="chore-actions" role="group" aria-label={`Actions for chore ${chore.title}`}>
      {hasSubmissions && (
        <button onClick={() => onViewHistory(chore)} aria-label={`View history of ${chore.title}`}>
          History
        </button>
      )}

      {isParent && (
        <button
          className="remove-btn"
          onClick={() => onDeleteChore(chore.id)}
          aria-label={`Remove chore ${chore.title}`}
        >
          Remove
        </button>
      )}

      {isParent && chore.status === "DONE" && hasSubmissions && (
        <button
          onClick={() => onViewSubmission({ chore, submission: latestSubmission })}
          aria-label={`View submission for ${chore.title}`}
        >
          View
        </button>
      )}

      {isChildAssigned && chore.status === "NOT_STARTED" && (
        <button onClick={() => onSubmit(chore)} aria-label={`Submit chore ${chore.title}`}>
          Submit
        </button>
      )}
    </div>
  );
}
