import ChildWeeklyStatsModal from "./ChildWeeklyStatsModal";
import { useState } from "react";

export default function ChildrenSection({ childrenStats, currentUser, onRemoveMember }) {
  const [selectedChildStats, setSelectedChildStats] = useState(null);

  return (
    <>
      <div className="children-section">
        <strong>Children</strong>
        <div className="member-cards">
          {childrenStats.map(({ child, stats, currentWeekStat }) => (
            <div key={child.id} className="member-card child-card">
              <span className="member-name">{child.firstName}</span>

              <div className="stats">
                <div>
                  <span className="label">Completed Chores:</span>{" "}
                  {currentWeekStat.completedChoresCount || 0}
                </div>
                <div>
                  <span className="label">Earned Coins:</span>{" "}
                  {currentWeekStat.earnedCoins || 0}
                </div>
              </div>

              <div className="member-actions">
                <button onClick={() => setSelectedChildStats({ child, stats })}>History</button>
                {currentUser.role === "PARENT" && (
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveMember(child.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedChildStats && (
        <ChildWeeklyStatsModal
          child={selectedChildStats.child}
          stats={selectedChildStats.stats}
          onClose={() => setSelectedChildStats(null)}
        />
      )}
    </>
  );
}
