import Modal from "../../../../shared/components/Modal";

export default function ChildWeeklyStatsModal({ child, stats, onClose }) {
  if (!child) return null;

  const hasStats = stats && stats.length > 0;

  return (
    <Modal
      title={`${child.firstName} Weekly Stats`}
      onClose={onClose}
      ariaLabel={`${child.firstName} weekly stats modal`}
    >
      {hasStats ? (
        <ul className="child-stats-list">
          {stats.map((week) => (
            <li key={week.id} className="child-stats-item">
              <div><strong>Week:</strong> {week.weekNumber}</div>
              <div><strong>Completed Chores:</strong> {week.completedChoresCount}</div>
              <div><strong>Earned Coins:</strong> {week.earnedCoins}</div>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p aria-live="polite">No history available</p>
      )}
    </Modal>
  );
}