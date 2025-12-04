import { useWeeklyChildStats } from "../../../shared/hooks/useWeeklyChildStats";
import useCurrentWeek from "../../../shared/hooks/useCurrentWeek";
import { useState } from "react";
import ChildWeeklyStatsModal from "./ChildWeeklyStatsModal";

export default function FamilyHeader({
  family,
  currentUser,
  onAddChore,
  onAddMember,
  onRemoveMember,
  onDeleteFamily,
}) {
  const parents = family.members.filter((m) => m.role === "PARENT");
  const children = family.members.filter((m) => m.role === "CHILD");

  const [selectedChildStats, setSelectedChildStats] = useState(null);

  const currentWeek = useCurrentWeek();

  return (
    <div className="family-header">
      <h1>Week {currentWeek}</h1>    

      <div className="family-wrapper"> 
        <div className="family-info">
          <h1>{family.familyName}</h1>
          {/* Parents section */}
          <div className="parents-section">
            <strong>Parents</strong>
            <div className="member-cards">
              {parents.map((p) => (
                <div key={p.id} className="member-card">
                  <span className="member-name">{p.firstName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Children section */}
        <div className="children-section">
          <strong>Children</strong>
          <div className="member-cards">
            {children.map((c) => {
              const { stats } = useWeeklyChildStats(c.id);

              const filteredStats = stats?.filter(s => s.familyId === family.id) || [];
              const currentWeekStat = filteredStats[0] || {};

              return (
                <div key={c.id} className="member-card child-card">
                  <span className="member-name">{c.firstName}</span>

                  <div className="stats">
                    <div>
                      <span className="label">Completed Chores:</span>{" "}
                      {(currentWeekStat.completedChoresCount || 0) + ", "}
                    </div>
                    <div>
                      <span className="label">Earned Coins:</span>{" "}
                      {currentWeekStat.earnedCoins || 0}
                    </div>
                  </div>

                  <div className="member-actions">
                    <button
                      title="Week History"
                      onClick={() => setSelectedChildStats({ 
                        child: c, 
                        stats: filteredStats
                      })}
                    >
                      History
                    </button>

                    {/* Remove member only for parents */}
                    {currentUser.role === "PARENT" && (
                      <button
                        title="Remove From Family"
                        className="remove-btn"
                        onClick={() => onRemoveMember(c.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parent actions: New Chore / Add Member / Remove Family */}
      {currentUser.role === "PARENT" && (
        <div className="family-actions">
          <button onClick={onAddChore}>New Chore</button>
          <button onClick={onAddMember}>Add Family Member</button>
          <button className="remove-btn" onClick={onDeleteFamily}>
            Remove Family
          </button>
        </div>
      )}

      {/* Weekly Stats Modal */}
      {selectedChildStats && (
        <ChildWeeklyStatsModal
          child={selectedChildStats.child}
          stats={selectedChildStats.stats}
          onClose={() => setSelectedChildStats(null)}
        />
      )}
    </div>
  );
}