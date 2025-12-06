export default function RoleSelect({ value, onChange }) {
  const roles = ["PARENT", "CHILD"];

  return (
    <fieldset className="role-select">
      <legend>Role</legend>
      {roles.map((role) => (
        <label key={role}>
          <input
            type="radio"
            name="role"
            value={role}
            checked={value === role}
            onChange={onChange}
          />{" "}
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </label>
      ))}
    </fieldset>
  );
}