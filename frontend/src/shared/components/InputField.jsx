import "../../css/shared/inputField.css";

export default function InputField({ label, type = "text", name, value, onChange, error, placeholder }) {

  const errorId = `${name}-error`;

  const renderErrors = () => {
    if (!error) return null;

    if (Array.isArray(error)) {
      return error.map((err, i) => (
        <span
          key={i}
          id={errorId}
          className={err.isValid ? "input-field-valid" : "input-field-error"}
          role={err.isValid ? undefined : "alert"}
        >
          {err.isValid ? "✅ " : "❌ "} {err.text}
        </span>
      ));
    }

    return (
      <span
        id={errorId}
        className={error.isValid ? "input-field-valid" : "input-field-error"}
        role={error.isValid ? undefined : "alert"}
      >
        {error.isValid ? "✅ " : "❌ "} {error.text || error}
      </span>
    );
  };

  return (
    <div className="input-field-container">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
      />
      {renderErrors()}
    </div>
  );
}