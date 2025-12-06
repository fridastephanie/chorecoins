export default function ParentsSection({ parents, currentUser, onRemoveMember }) {
  return (
    <section className="parents-section" aria-label="Parents list">
      <strong>Parents</strong>
      <div className="member-cards" role="list">
        {parents.map(p => (
          <article key={p.id} className="member-card" role="listitem" aria-label={`Parent ${p.firstName}`}>
            <span className="member-name">{p.firstName}</span>
            {currentUser.role === "PARENT" && (
              <button
                title={`Remove ${p.firstName} from family`}
                className="remove-btn"
                onClick={() => onRemoveMember(p.id)}
                aria-label={`Remove ${p.firstName} from family`}
              >
                Remove
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}