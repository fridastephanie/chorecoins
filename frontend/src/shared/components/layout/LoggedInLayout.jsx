import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

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
