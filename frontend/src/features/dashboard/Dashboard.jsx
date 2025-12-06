import { useMemo } from "react";
import FamilyList from "./components/FamilyList";
import NewFamilyButton from "./components/NewFamilyButton";
import ErrorBanner from "../../shared/components/ErrorBanner";
import "../../css/features/dashboard.css";
import boygirlChoreImage from "../../assets/girl_boy_laundry.png";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";
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
    <FamilyProvider userId={user?.id}>
      <DashboardContent user={user} />
    </FamilyProvider>
  );
}

function DashboardContent({ user }) {
  const { families, error, addFamily } = useFamiliesContext(); 

  return (
    <div className="dashboard-container">
      <ErrorBanner message={error} />
      <h1>Dashboard</h1>
      <img
        src={boygirlChoreImage}
        alt="Girl and boy doing laundry"
        className="dashboard-image"
      />

      <FamilyList families={families} />

      {user?.role === "PARENT" && (
        <NewFamilyButton onFamilyCreated={addFamily} />
      )}
    </div>
  );
}