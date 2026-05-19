import { getIO } from "../socket.js";

export const emitTaskCreated = (task) => {
  const io = getIO();

  io.emit("taskCreated", task);
};

export const emitTaskUpdated = (task) => {
  const io = getIO();

  io.emit("taskUpdated", task);
};

export const emitTaskDeleted = (taskId) => {
  const io = getIO();

  io.emit("taskDeleted", taskId);
};

export const emitDashboardUpdate = () => {
  const io = getIO();

  io.emit("dashboardUpdated");
};
