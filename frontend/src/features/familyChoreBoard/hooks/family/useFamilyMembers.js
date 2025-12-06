import { useMemo } from "react";
import { useAllChildrenStats } from "../../hooks/family/useAllChildrenStats";

export default function useFamilyMembers(members, familyId) {
  /**
   * Filters and returns all members with role "PARENT".
   */
  const parents = useMemo(() => members.filter(m => m.role === "PARENT"), [members]);

  /**
   * Filters and returns all members with role "CHILD".
   */
  const children = useMemo(() => members.filter(m => m.role === "CHILD"), [members]);

  /**
   * Fetches and returns stats for all child members in the family.
   */
  const childrenStats = useAllChildrenStats(children, familyId);

  return { parents, childrenStats };
}
