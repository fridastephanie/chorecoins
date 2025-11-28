import ChoreCard from "./ChoreCard";

export default function ChoreColumn({ column, chores, currentUser, onSubmit, onViewHistory }) {
  return (
    <div className="chore-column">
      <h2>{column.title}</h2>
      <div className="chore-list">
        {chores.map((chore) => (
          <ChoreCard
            key={chore.id}
            chore={chore}
            currentUser={currentUser}
            onSubmit={onSubmit}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    </div>
  );
}
