export default function FamilyActions({ currentUser, onAddChore, onAddMember, onDeleteFamily }) {
  if (currentUser.role !== "PARENT") return null;

  return (
    <div className="family-actions" role="group" aria-label="Family management actions">
      <button onClick={onAddChore} aria-label="Create a new chore">New Chore</button>
      <button onClick={onAddMember} aria-label="Add a new family member">Add Family Member</button>
      <button className="remove-btn" onClick={onDeleteFamily} aria-label="Remove family">Remove Family</button>
    </div>
  );
}