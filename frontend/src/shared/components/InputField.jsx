import "../../css/shared/inputField.css";

export default function InputField({ label, type = "text", name, value, onChange, error, placeholder }) {
  
  const renderErrors = () => {
    if (!error) return null;

    if (Array.isArray(error)) {
      return error.map((err, i) => (
        <span key={i} className={err.isValid ? "input-field-valid" : "input-field-error"}>
          {err.isValid ? "✅ " : "❌ "} {err.text}
        </span>
      ));
    }

    return <span className={error.isValid ? "input-field-valid" : "input-field-error"}>
      {error.isValid ? "✅ " : "❌ "} {error.text || error}
    </span>;
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
      />
      {renderErrors()}
    </div>
  );
}