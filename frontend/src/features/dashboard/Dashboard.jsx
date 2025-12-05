import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NewFamilyModal from "./components/NewFamilyModal";
import ErrorBanner from "../../shared/components/ErrorBanner";
import "../../css/features/dashboard.css";
import boygirlChoreImage from "../../assets/girl_boy_laundry.png";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

// Importera context
import { FamilyProvider, useFamiliesContext } from "../../shared/context/FamilyContext";

export default function Dashboard() {
  useDocumentTitle("Dashboard");

  /**
   * Retrieves the current logged-in user from localStorage.
   * Memoized to avoid unnecessary parsing on re-renders.
   */
  const user = useMemo(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  }, []);

  return (
    // Wrap hela Dashboard i FamilyProvider
    <FamilyProvider userId={user?.id}>
      <DashboardContent user={user} />
    </FamilyProvider>
  );
}

function DashboardContent({ user }) {
  const { families, error, addFamily } = useFamiliesContext(); // använd context
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard-container">
      <ErrorBanner message={error} />
      <h1>Dashboard</h1>
      <img
        src={boygirlChoreImage}
        alt="Girl and boy doing laundry"
        className="dashboard-image"
      />

      {/* List of families */}
      <ul className="family-list">
        {families.map((f) => (
          <li key={f.id}>
            <Link to={`/family-choreboard/${f.id}`}>→ {f.familyName}</Link>
          </li>
        ))}
      </ul>

      {/* Only parents can create new families */}
      {user?.role === "PARENT" && (
        <>
          <button onClick={() => setShowModal(true)}>New Family</button>
          {showModal && (
            <NewFamilyModal
              onClose={() => setShowModal(false)}
              onFamilyCreated={addFamily} // uppdaterar context
            />
          )}
        </>
      )}
    </div>
  );
}