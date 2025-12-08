import HomeLink from "../../shared/components/HomeLink";
import confusedBoy from "../../assets/boy_confused.png";
import "../../css/features/notFoundPage.css";

export const NotFoundPage = () => {
  return (
    <main 
      className="notfound-container" 
      aria-labelledby="notfound-title"
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
        alt="Illustration of a confused boy next to an empty coin pouch, symbolizing that the page could not be found."
        className="notfound-image"
      />

      <HomeLink aria-label="Go back to the homepage" />
    </main>
  );
};
