export default function InputField({ label, type, name, value, onChange, error, placeholder }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
      />
      {error && <span style={{ color: "red", fontSize: "0.9em" }}>{error}</span>}
    </div>
  );
}