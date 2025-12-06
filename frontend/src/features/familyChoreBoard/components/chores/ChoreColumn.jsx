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
    <div className="chore-column">
      <h2>{column.title}</h2>

      {chores.length === 0 ? (
        <p className="no-chores">No chores yet</p>
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
    </div>
  );
}
