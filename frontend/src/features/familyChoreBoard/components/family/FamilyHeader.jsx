import useCurrentWeek from "../../../../shared/hooks/useCurrentWeek";
import useFamilyMembers from "../../hooks/family/useFamilyMembers";

import ParentsSection from "./ParentsSection";
import ChildrenSection from "./ChildrenSection";
import FamilyActions from "./FamilyActions";

export default function FamilyHeader({ family, currentUser, onAddChore, onAddMember, onRemoveMember, onDeleteFamily }) {
  const currentWeek = useCurrentWeek();
  const { parents, childrenStats } = useFamilyMembers(family.members, family.id);

  return (
    <div className="family-header">
      <h1>Week {currentWeek}</h1>      

      <div className="family-wrapper">
        <div className="family-info">
          <h1>✨{family.familyName}’s Chore Board✨</h1>          
          <ParentsSection parents={parents} currentUser={currentUser} onRemoveMember={onRemoveMember} />
          <ChildrenSection childrenStats={childrenStats} currentUser={currentUser} onRemoveMember={onRemoveMember} />
        </div>
      </div>

      <FamilyActions currentUser={currentUser} onAddChore={onAddChore} onAddMember={onAddMember} onDeleteFamily={onDeleteFamily} />
    </div>
  );
}
