import "../../css/features/landing.css";
import familyImage from "../../assets/family_inside.png";
import AuthButtons from "./components/AuthButtons";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

export default function Landing() {
  useDocumentTitle("Home");
  return (
    <div className="landing-container">
      <img 
        src={familyImage} 
        alt="Happy family illustration" 
        className="landing-image"
      />      
      <AuthButtons />
      <h1 className="landing-title">Welcome to ChoreCoins!</h1>
      <div className="landing-info">
        <p>
          ChoreCoins is a fun and easy way for families to manage chores and earn coins. 
          Parents can create a family account and add members, including children and other parents.
        </p>
        <p>
          Once set up, parents can assign chores to children, each with a specific coin value. 
          Kids complete their chores and submit them with comments, and parents review the submissions to approve or reject them.
        </p>
        <p>
          If a chore is rejected, the child can try again; if approved, the coins are added to the child’s weekly allowance. 
          The app tracks each child’s completed chores and current coin balance, giving families a clear overview of progress.
        </p>
        <p>
          Weekly coin balances reset every Monday, keeping the system fresh and motivating for the whole family.
        </p>
      </div>
    </div>
  );
}