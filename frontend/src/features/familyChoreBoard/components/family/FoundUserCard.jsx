export default function FoundUserCard({ user, onAdd, isAlreadyMember }) {
  return (
    <div className="found-user">
      <strong>{user.firstName} ({user.role})</strong>
      <button onClick={onAdd} disabled={isAlreadyMember}>
        {isAlreadyMember ? "Already a member" : "Add to Family"}
      </button>
    </div>
  );
}