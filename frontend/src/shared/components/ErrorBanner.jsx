import { useError } from "../context/ErrorContext";
import "../../css/shared/errorBanner.css";

export default function ErrorBanner() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div 
      className="error-banner" 
      onClick={clearError} 
      role="alert" 
      aria-live="polite" 
      tabIndex={0} 
      onKeyDown={(e) => { if(e.key === "Enter" || e.key === " ") clearError(); }}
    >
      {error}
      <span 
        className="error-banner-close" 
        aria-hidden="true"
      >
        ×
      </span>
    </div>
  );
}