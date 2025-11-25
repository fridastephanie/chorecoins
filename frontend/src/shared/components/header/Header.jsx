import "./css/header.css";
import logo from "../../../assets/logo.png"; 

export default function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="ChoreCoins Logo" className="app-header_logo" />
      <h1 className="app-header_title">ChoreCoins</h1>
    </header>
  );
}