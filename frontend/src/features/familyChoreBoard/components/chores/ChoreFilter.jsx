export default function ChoreFilter({ childrenList, filterChildId, setFilterChildId }) {
  return (
    <div className="chore-filter">
      <label htmlFor="childFilter">Filter by child: </label>
      <select
        id="childFilter"
        value={filterChildId || ""}
        onChange={(e) => setFilterChildId(e.target.value || null)}
      >
        <option value="">All</option>
        {childrenList.map((child) => (
          <option key={child.id} value={child.id}>
            {child.firstName}
          </option>
        ))}
      </select>
    </div>
  );
}
