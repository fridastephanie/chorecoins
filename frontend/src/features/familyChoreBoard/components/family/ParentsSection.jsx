export default function ParentsSection({ parents, currentUser, onRemoveMember }) {
  return (
    <div className="parents-section">
      <strong>Parents</strong>
      <div className="member-cards">
        {parents.map(p => (
          <div key={p.id} className="member-card">
            <span className="member-name">{p.firstName}</span>
            {currentUser.role === "PARENT" && (
              <button
                title="Remove From Family"
                className="remove-btn"
                onClick={() => onRemoveMember(p.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}