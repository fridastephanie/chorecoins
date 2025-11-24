import "./css/landing.css";
import HeroButtons from "./components/HeroButtons";

export default function Landing() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to ChoreCoin</h1>
      <HeroButtons />
    </div>
  );
}