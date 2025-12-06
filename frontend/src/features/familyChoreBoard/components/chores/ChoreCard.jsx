import ChoreActions from "./ChoreActions";

function ChoreDueDate({ dueDate, status }) {
  if (!dueDate || status !== "NOT_STARTED") return null;
  const formattedDate = new Date(dueDate).toLocaleDateString();
  return (
    <p>
      <strong>Due Date:</strong> {formattedDate}
    </p>
  );
}

export default function ChoreCard({
  chore,
  currentUser,
  onSubmit,
  onViewHistory,
  onDeleteChore,
  onViewSubmission,
}) {
  return (
    <article className="chore-card" aria-labelledby={`chore-title-${chore.id}`}>
      <h3 id={`chore-title-${chore.id}`}>{chore.title}</h3>
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

      <ChoreDueDate dueDate={chore.dueDate} status={chore.status} />

      <ChoreActions
        chore={chore}
        currentUser={currentUser}
        onSubmit={onSubmit}
        onViewHistory={onViewHistory}
        onDeleteChore={onDeleteChore}
        onViewSubmission={onViewSubmission}
      />
    </article>
  );
}
