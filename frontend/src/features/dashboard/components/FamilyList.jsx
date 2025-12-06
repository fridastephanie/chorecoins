import { Link } from "react-router-dom";

export default function FamilyList({ families }) {
  return (
    <ul className="family-list">
      {families.map((f) => (
        <li key={f.id}>
          <Link to={`/family-choreboard/${f.id}`}>→ {f.familyName}</Link>
        </li>
      ))}
    </ul>
  );
}