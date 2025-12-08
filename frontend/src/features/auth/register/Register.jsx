import "../../../css/features/auth.css";
import boyVacuumImage from "../../../assets/boy_vacuum.png";
import RegisterForm from "./components/RegisterForm";
import useDocumentTitle from "../../../shared/hooks/useDocumentTitle";
import HomeLink from "../../../shared/components/HomeLink";

export default function Register() {
  useDocumentTitle("Register");
  return (
    <main className="register-container" aria-labelledby="register-heading">
      <img 
        src={boyVacuumImage} 
        alt="Illustration of a boy vacuuming" 
        className="register-image" 
      />
      <h2 className="register-title" id="register-heading">Register</h2>
      <RegisterForm />
      <HomeLink />
    </main>
  );
}