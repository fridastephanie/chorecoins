import { useState } from "react";
import useCurrentWeek from "../../../shared/hooks/useCurrentWeek";
import { useAllChildrenStats } from "../hooks/useAllChildrenStats";
import ChildWeeklyStatsModal from "./ChildWeeklyStatsModal";

export default function FamilyHeader({
  family,
  currentUser,
  onAddChore,
  onAddMember,
  onRemoveMember,
  onDeleteFamily,
  navigate
}) {
  const [members, setMembers] = useState(family.members);
  const [selectedChildStats, setSelectedChildStats] = useState(null);

  const currentWeek = useCurrentWeek();

  const parents = members.filter((m) => m.role === "PARENT");
  const children = members.filter((m) => m.role === "CHILD");

  const childrenStats = useAllChildrenStats(children, family.id);

  return (
    <div className="family-header">
      <h1>Week {currentWeek}</h1>

      <div className="family-wrapper">
        <div className="family-info">
          <h1>{family.familyName}</h1>

          <div className="parents-section">
            <strong>Parents</strong>
            <div className="member-cards">
              {parents.map((p) => (
                <div key={p.id} className="member-card">
                  <span className="member-name">{p.firstName}</span>
                  {currentUser.role === "PARENT" && (
                    <button
                      title="Remove From Family"
                      className="remove-btn"
                      onClick={() => onRemoveMember(p.id)} 
                      >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="children-section">
          <strong>Children</strong>
          <div className="member-cards">
            {childrenStats.map(({ child, stats, currentWeekStat }) => (
              <div key={child.id} className="member-card child-card">
                <span className="member-name">{child.firstName}</span>

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
                    onClick={() => setSelectedChildStats({ child, stats })}
                  >
                    History
                  </button>

                  {currentUser.role === "PARENT" && (
                    <button
                      title="Remove From Family"
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
      </div>

      {currentUser.role === "PARENT" && (
        <div className="family-actions">
          <button onClick={onAddChore}>New Chore</button>
          <button onClick={onAddMember}>Add Family Member</button>
          <button className="remove-btn" onClick={onDeleteFamily}>
            Remove Family
          </button>
        </div>
      )}

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
