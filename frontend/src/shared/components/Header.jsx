import logo from "../../assets/logo.png"; 
import "../../css/shared/header.css";

export default function Header() {
  return (
    <header className="app-header">
      <img 
        src={logo} 
        alt="ChoreCoins logo" 
        className="app-header_logo" 
      />
      <h1 className="app-header_title">ChoreCoins</h1>
    </header>
  );
}