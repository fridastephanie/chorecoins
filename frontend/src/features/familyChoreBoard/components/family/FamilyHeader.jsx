import useCurrentWeek from "../../../../shared/hooks/useCurrentWeek";
import useFamilyMembers from "../../hooks/family/useFamilyMembers";

import ParentsSection from "./ParentsSection";
import ChildrenSection from "./ChildrenSection";
import FamilyActions from "./FamilyActions";

export default function FamilyHeader({ family, currentUser, onAddChore, onAddMember, onRemoveMember, onDeleteFamily }) {
  const currentWeek = useCurrentWeek();
  const { parents, childrenStats } = useFamilyMembers(family.members, family.id);

  return (
    <header className="family-header">
      <h1 aria-label={`Current week: ${currentWeek}`}>Week {currentWeek}</h1>      

      <section className="family-wrapper" aria-label="Family information">
        <div className="family-info">
          <h2>✨{family.familyName}’s Chore Board✨</h2>          
          <ParentsSection parents={parents} currentUser={currentUser} onRemoveMember={onRemoveMember} />
          <ChildrenSection childrenStats={childrenStats} currentUser={currentUser} onRemoveMember={onRemoveMember} />
        </div>
      </section>

      <FamilyActions
        currentUser={currentUser}
        onAddChore={onAddChore}
        onAddMember={onAddMember}
        onDeleteFamily={onDeleteFamily}
      />
    </header>
  );
}
