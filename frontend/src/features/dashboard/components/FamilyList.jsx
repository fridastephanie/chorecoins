import { Link } from "react-router-dom";

export default function FamilyList({ families }) {
  if (!families || families.length === 0) {
    return (
      <p className="family-list-empty">
        You are not a member of any family yet
      </p>
    );
  }

  return (
    <ul className="family-list">
      {families.map((f) => (
        <li key={f.id}>
          <Link
            to={`/family-choreboard/${f.id}`}
            aria-label={`Go to ${f.familyName} choreboard`}
          >
            → {f.familyName}
          </Link>
        </li>
      ))}
    </ul>
  );
}