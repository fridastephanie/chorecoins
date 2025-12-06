import ChoreCard from "./ChoreCard";

export default function ChoreColumn({
  column,
  chores,
  currentUser,
  onSubmit,
  onViewHistory,
  onDeleteChore,
  onViewSubmission,
}) {
  return (
    <section className="chore-column" aria-labelledby={`column-title-${column.status}`}>
      <h3 id={`column-title-${column.status}`}>{column.title}</h3>

      {chores.length === 0 ? (
        <p className="no-chores" aria-live="polite">No chores yet</p>
      ) : (
        chores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            currentUser={currentUser}
            onSubmit={onSubmit}
            onViewHistory={onViewHistory}
            onDeleteChore={onDeleteChore}
            onViewSubmission={onViewSubmission} 
          />
        ))
      )}
    </section>
  );
}
