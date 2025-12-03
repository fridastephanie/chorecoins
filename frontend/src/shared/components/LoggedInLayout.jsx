import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "../../css/shared/loggedInLayout.css";

export default function LoggedInLayout() {
  return (
    <>
      <Navbar />      
      <div className="layout-container">
        <Outlet />
      </div>
    </>
  );
}
