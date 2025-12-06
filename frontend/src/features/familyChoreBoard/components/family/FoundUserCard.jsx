export default function FoundUserCard({ user, onAdd, isAlreadyMember }) {
  return (
    <article className="found-user" aria-label={`User card for ${user.firstName}, role: ${user.role}`}>
      <strong>{user.firstName} ({user.role})</strong>
      <button
        onClick={onAdd}
        disabled={isAlreadyMember}
        aria-label={isAlreadyMember ? `${user.firstName} is already a member` : `Add ${user.firstName} to family`}
      >
        {isAlreadyMember ? "Already a member" : "Add to Family"}
      </button>
    </article>
  );
}