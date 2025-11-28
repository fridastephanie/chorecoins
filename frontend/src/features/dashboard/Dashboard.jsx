import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useFamilies from "./hooks/useFamilies";
import NewFamilyModal from "./components/NewFamilyModal";
import ErrorBanner from "../../shared/components/errorBanner/ErrorBanner";
import "./css/dashboard.css";

export default function Dashboard() {
  /**
   * Retrieves the current logged-in user from localStorage.
   * Memoized to avoid unnecessary parsing on re-renders.
   */
  const user = useMemo(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  }, []);

  // Controls whether the "New Family" modal is visible.
  const [showModal, setShowModal] = useState(false);

  /**
   * Custom hook to fetch families for the current user.
   * Provides `families` array, `error` state, and `addFamily` function to update local state.
   */
  const { families, error, addFamily } = useFamilies(user?.id);

  return (
    <div className="dashboard-container">
      <ErrorBanner message={error} />

      <h1>Dashboard</h1>

      {/* Only parents can create new families */}
      {user?.role === "PARENT" && (
        <button onClick={() => setShowModal(true)}>New Family</button>
      )}

      {/* List of families */}
      <ul className="family-list">
        {families.map((f) => (
          <li key={f.id}>
            <Link to={`/family-choreboard/${f.id}`}>{f.familyName}</Link>
          </li>
        ))}
      </ul>

      {/* Modal for creating a new family */}
      {showModal && (
        <NewFamilyModal
          onClose={() => setShowModal(false)}
          onFamilyCreated={addFamily}
        />
      )}
    </div>
  );
}