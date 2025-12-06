import ChildWeeklyStatsModal from "./ChildWeeklyStatsModal";
import { useState } from "react";

export default function ChildrenSection({ childrenStats, currentUser, onRemoveMember }) {
  const [selectedChildStats, setSelectedChildStats] = useState(null);

  return (
    <>
      <section className="children-section" aria-label="Children list">
        <strong>Children</strong>
        <div className="member-cards">
          {childrenStats.map(({ child, stats, currentWeekStat }) => (
            <article key={child.id} className="member-card child-card" aria-labelledby={`child-name-${child.id}`}>
              <span id={`child-name-${child.id}`} className="member-name">{child.firstName}</span>

              <div className="stats">
                <div>
                  <span className="label">Completed Chores:</span>{" "}
                  {currentWeekStat.completedChoresCount || 0}{", "}
                </div>
                <div>
                  <span className="label">Earned Coins:</span>{" "}
                  {currentWeekStat.earnedCoins || 0}
                </div>
              </div>

              <div className="member-actions">
                <button
                  onClick={() => setSelectedChildStats({ child, stats })}
                  aria-label={`View weekly history for ${child.firstName}`}
                >
                  History
                </button>

                {currentUser.role === "PARENT" && (
                  <button
                    className="remove-btn"
                    onClick={() => onRemoveMember(child.id)}
                    aria-label={`Remove ${child.firstName} from family`}
                  >
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

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
