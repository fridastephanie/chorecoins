import "../../../css/features/auth.css";
import girlDishwasherImage from "../../../assets/girl_dishwasher.png";
import LoginForm from "./components/LoginForm";
import useDocumentTitle from "../../../shared/hooks/useDocumentTitle";
import HomeLink from "../../../shared/components/HomeLink";


export default function Login() {
  useDocumentTitle("Login");
  return (
    <main className="login-container" aria-labelledby="login-heading" >
      <img 
        src={girlDishwasherImage} 
        alt="Illustration of a girl emptying dishwasher" 
        className="login-image" 
      />
      <h2 className="login-title" id="login-heading">Login</h2>
      <LoginForm />
      <HomeLink />
    </main>
  );
}
