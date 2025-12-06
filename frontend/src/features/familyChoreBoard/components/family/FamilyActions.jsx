export default function FamilyActions({ currentUser, onAddChore, onAddMember, onDeleteFamily }) {
  if (currentUser.role !== "PARENT") return null;

  return (
    <div className="family-actions">
      <button onClick={onAddChore}>New Chore</button>
      <button onClick={onAddMember}>Add Family Member</button>
      <button className="remove-btn" onClick={onDeleteFamily}>Remove Family</button>
    </div>
  );
}
