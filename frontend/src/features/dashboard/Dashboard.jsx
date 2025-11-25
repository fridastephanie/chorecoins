import "./css/dashboard.css";

export default function Dashboard() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const name = user?.firstName || "User";

  return (
    <>
      <div className="dashboard-container">
      </div>
    </>
  );
}