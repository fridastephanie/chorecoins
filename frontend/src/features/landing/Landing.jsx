import "../../css/features/landing.css";
import familyImage from "../../assets/family_inside.png";
import AuthButtons from "./components/AuthButtons";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

export default function Landing() {
  useDocumentTitle("Home");

  return (
    <main className="landing-container">
      <header className="landing-header">
        <img 
          src={familyImage} 
          alt="Illustration of a happy family inside their home" 
          className="landing-image"
        />      
        <AuthButtons />
        <h2 className="landing-title">Welcome to ChoreCoins!</h2>
      </header>

      <section className="landing-info" aria-labelledby="landing-info-title">
        <h3 id="landing-info-title" className="visually-hidden">
          ✨How ChoreCoins works✨
        </h3>
        <p>
          ChoreCoins makes it easy for families to manage chores and earn coins. 
          Parents can create a family, add members and assign chores with coin values.
        </p>
        <p>
          Kids complete chores and submit them with comments and/or images. 
          Parents can then approve or reject submissions. 
          Approved chores add coins to the child’s weekly allowance, while rejected chores can be retried.
        </p>
        <p>
          Each child’s weekly history shows completed chores and earned coins by family. 
          Weekly coin balances reset and approved chores are automatically cleared every Monday, 
          and overdue not-started chores are removed.
        </p>
      </section>
    </main>
  );
}