export default function FamilyHeader({
  family,
  currentUser,
  onAddChore,
  onAddMember,
  onRemoveMember,
  onDeleteFamily,
}) {
  const parents = family.members.filter((m) => m.role === "PARENT");
  const children = family.members.filter((m) => m.role === "CHILD");

  return (
    <div className="family-header">
      <h1>{family.familyName}</h1>

      <div className="family-info">
        <div>
          <strong>Parents:</strong>{" "}
          {parents.map((p) => p.firstName).join(", ")}
        </div>

        <div>
          <strong>Children:</strong>
          {children.map((c) => (
            <div key={c.id} className="child-stats">
              <span>{c.firstName}</span>
              <span>Completed Chores: {c.completedChoresCount || 0}</span>
              <span>Earned Coins: {c.earnedCoins || 0}</span>

              {currentUser.role === "PARENT" && (
                <button
                  className="danger"
                  onClick={() => onRemoveMember(c.id)}
                >
                  Remove Member
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {currentUser.role === "PARENT" && (
        <div className="family-actions">
          <button onClick={onAddChore}>New Chore</button>
          <button onClick={onAddMember}>Add Family Member</button>

          <button className="danger" onClick={onDeleteFamily}>
            Remove Family
          </button>
        </div>
      )}
    </div>
  );
}
