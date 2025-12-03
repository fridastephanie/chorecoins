import { useError } from "../context/ErrorContext";
import "../../css/shared/errorBanner.css";

export default function ErrorBanner() {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="error-banner" onClick={clearError}>
      {error}
      <span className="error-banner-close">×</span>
    </div>
  );
}
