import "../../../css/features/auth.css";
import girlDishwasherImage from "../../../assets/girl_dishwasher.png";
import LoginForm from "./components/LoginForm";
import useDocumentTitle from "../../../shared/hooks/useDocumentTitle";
import HomeLink from "../../../shared/components/HomeLink";


export default function Login() {
  useDocumentTitle("Login");
  return (
    <div className="login-container">
      <img 
        src={girlDishwasherImage} 
        alt="Illustration of a girl emptying dishwasher" 
        className="login-image" 
      />
      <h2 className="login-title">Login</h2>
      <LoginForm />
      <HomeLink />
    </div>
  );
}
