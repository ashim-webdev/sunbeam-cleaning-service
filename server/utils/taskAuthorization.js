export const canAccessTask = (task, user) => {
  if (!task || !user) return false;

  // ADMIN ACCESS
  if (user.isAdmin) return true;

  const userId = user._id.toString();

  // OLD TASK STRUCTURE
  if (Array.isArray(task.team)) {
    return task.team.some((member) => {
      const memberId =
        typeof member === "object"
          ? member._id?.toString()
          : member.toString();

      return memberId === userId;
    });
  }

  // NEW TASK STRUCTURE
  const members = task?.team?.members || [];
  const leader = task?.team?.leader;

  const isMember = members.some((member) => {
    const memberId =
      typeof member === "object"
        ? member._id?.toString()
        : member.toString();

    return memberId === userId;
  });

  const leaderId =
    typeof leader === "object"
      ? leader?._id?.toString()
      : leader?.toString();

  return isMember || leaderId === userId;
};

export const canChangeTaskStage = (task, user) => {
  if (!task || !user) return false;

  // ADMIN
  if (user.isAdmin) return true;

  const userId = user._id.toString();

  // TASK LEADER
  const leaderId =
    typeof task.team?.leader === "object"
      ? task.team?.leader?._id?.toString()
      : task.team?.leader?.toString();

  return leaderId === userId;
};

export const adminOnly = (user) => {
  return user?.isAdmin;
};


export const canCompleteSubTask = (task, user) => {
  if (!task || !user) return false;

  // ADMIN
  if (user.isAdmin) return true;

  const userId = user._id.toString();

  // TASK LEADER
  const leaderId =
    typeof task.team?.leader === "object"
      ? task.team?.leader?._id?.toString()
      : task.team?.leader?.toString();

  return leaderId === userId;
};