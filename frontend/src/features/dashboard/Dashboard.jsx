import { useMemo, useState } from "react";
import useFamilies from "./hooks/useFamilies";
import NewFamilyModal from "./components/NewFamilyModal";
import ErrorBanner from "../../shared/components/errorBanner/ErrorBanner";
import "./css/dashboard.css";

export default function Dashboard() {
  const user = useMemo(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  }, []);

  const [showModal, setShowModal] = useState(false);
  const { families, error, addFamily } = useFamilies(user?.id);

  return (
    <div className="dashboard-container">
      <ErrorBanner message={error} />

      <h1>Dashboard</h1>

      {user?.role === "PARENT" && (
        <button onClick={() => setShowModal(true)}>New Family</button>
      )}

      <ul className="family-list">
        {families.map((f) => (
          <li key={f.id}>
            <a href={`/family/${f.id}`}>{f.familyName}</a>
          </li>
        ))}
      </ul>

      {showModal && (
        <NewFamilyModal
          onClose={() => setShowModal(false)}
          onFamilyCreated={addFamily}
        />
      )}
    </div>
  );
}