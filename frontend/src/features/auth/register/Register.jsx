import "./css/register.css";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <RegisterForm />
    </div>
  );
}