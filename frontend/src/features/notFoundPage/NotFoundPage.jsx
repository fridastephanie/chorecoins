import { useNavigate } from "react-router-dom";
import confusedBoy from "../../assets/boy_confused.png";
import "../../css/features/notFoundPage.css";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main 
      className="notfound-container" 
      aria-labelledby="notfound-title"
      role="main"
    >
      <h2 
        id="notfound-title" 
        className="notfound-title" 
        role="alert"
      >
        404 – Page Not Found
      </h2>

      <img
        src={confusedBoy}
        alt="A confused boy looking at an empty coin pouch, illustrating a missing page."
        className="notfound-image"
        role="img"
      />

      <button
        onClick={handleBack}
        className="notfound-back-btn"
        aria-label="Go back to the previous page"
      >
        ← Go Back
      </button>
    </main>
  );
};