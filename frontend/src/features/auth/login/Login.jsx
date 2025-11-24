import "./css/login.css";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <LoginForm />
    </div>
  );
}