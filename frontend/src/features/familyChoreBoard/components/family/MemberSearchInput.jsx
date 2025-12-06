export default function MemberSearchInput({ labelText = "Email", email, setEmail, onSearch }) {
  return (
    <div className="member-search" role="search" aria-label="Search for family member">
      <label htmlFor="search-email">{labelText}</label>
      <input
        id="search-email"
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={onSearch} aria-label="Search for user by email">Search</button>
    </div>
  );
}