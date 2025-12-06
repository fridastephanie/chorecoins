import { useFamilyApi } from "../../../shared/hooks/useApi/useFamilyApi";
import { useChoreApi } from "../../../shared/hooks/useApi/useChoreApi";
import { useError } from "../../../shared/context/ErrorContext";

export default function useFamilyBoardActions(familyId, currentUser, reload, removeFamily, navigate, openConfirmModal) {
  const { removeFamilyMemberApi, deleteFamilyApi } = useFamilyApi();
  const { handleDeleteChore, approveChoreSubmission, rejectChoreSubmission } = useChoreApi();
  const { showError } = useError();

  /**
   * Handles removing a member from the family.
   * Checks if the member is the last parent and shows error or deletes family if necessary.
   */
  const handleRemoveMember = (member, familyMembers) => {
    if (!member) return;

    const isLastParent =
      member.role === "PARENT" &&
      familyMembers.filter((m) => m.role === "PARENT").length === 1;

    if (member.id === currentUser.id && !isLastParent) {
      showError("You cannot remove yourself while there is another parent in the family.");
      return;
    }

    openConfirmModal({
      title: "Remove Family Member?",
      message: "Are you sure you want to remove this member?",
      onConfirm: async () => {
        try {
          if (isLastParent) {
            await deleteFamilyApi(familyId);
            removeFamily(Number(familyId));
            navigate("/dashboard", { replace: true });
          } else {
            await removeFamilyMemberApi(familyId, member.id);
            await reload();
            if (member.id === currentUser.id) navigate("/dashboard", { replace: true });
          }
        } catch (err) {
          console.error("Failed to remove member:", err);
        }
      },
    });
  };

  /**
   * Handles deleting the entire family after confirmation.
   */
  const handleDeleteFamily = () => {
    openConfirmModal({
      title: "Delete Family?",
      message: "Are you sure you want to delete this family? This action cannot be undone.",
      onConfirm: async () => {
        await deleteFamilyApi(familyId);
        removeFamily(Number(familyId));
        navigate("/dashboard");
      },
    });
  };

  /**
   * Handles deleting a chore after confirmation and reloads the data.
   */
  const handleDeleteChoreLocal = (choreId) => {
    openConfirmModal({
      title: "Delete Chore?",
      message: "Are you sure you want to delete this chore?",
      onConfirm: async () => {
        await handleDeleteChore(choreId);
        await reload();
      },
    });
  };

  return {
    handleRemoveMember,
    handleDeleteFamily,
    handleDeleteChoreLocal,
    approveChoreSubmission,
    rejectChoreSubmission
  };
}
