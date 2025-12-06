export default function MemberSearchInput({ email, setEmail, onSearch }) {
  return (
    <>
      <input
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>
    </>
  );
}