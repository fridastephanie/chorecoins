import { Link } from "react-router-dom";
import "../../css/shared/homeLink.css"; 

export default function HomeLink() {
  return (
    <Link to="/" className="home-link">
      ← Home
    </Link>
  );
}