import api from "./api";

export const getChoreById = (choreId) =>
  api.get(`/chores/${choreId}`);

export const getChoresForFamily = (familyId) =>
  api.get(`/chores/family/${familyId}`);

export const getChoresForChild = (childId) =>
  api.get(`/chores/child/${childId}`);

export const createChore = (data) =>
  api.post("/chores", data);

export const submitChoreAndReturnChore = (choreId, submissionData) =>
  api.post(`/chores/${choreId}/submit`, submissionData);

export const approveChore = (choreId, submissionId, comment) =>
  api.patch(`/chores/${choreId}/submissions/${submissionId}/approve`, {
    commentParent: comment,
  });

export const rejectChore = (choreId, submissionId, comment) =>
  api.patch(`/chores/${choreId}/submissions/${submissionId}/reject`, {
    commentParent: comment,
  });

export const deleteChore = (choreId) =>
  api.delete(`/chores/${choreId}`);