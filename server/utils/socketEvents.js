import { getIO, onlineUsers } from "../socket.js";
import User from "../models/userModel.js";

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


export const emitLeaveCreated = (payload) => {
  const io = getIO();

  const { recipients } = payload;

  recipients.forEach((userId) => {
    const socketId = onlineUsers.get(userId.toString());

    if (socketId) {
      io.to(socketId).emit("leaveCreated", payload);
    }
  });
};


export const emitLeaveStatusUpdate = async (payload) => {
  const io = getIO();

  // 1. notify employee
  const userSocketId = onlineUsers.get(payload.userId.toString());

  if (userSocketId) {
    io.to(userSocketId).emit("leaveUpdated", payload);
  }

  // 2. notify all admins
  const admins = await User.find({ isAdmin: true }).select("_id");

  admins.forEach((admin) => {
    const adminSocketId = onlineUsers.get(admin._id.toString());

    if (adminSocketId) {
      io.to(adminSocketId).emit("leaveUpdated", payload);
    }
  });
};



export const emitEventCreated = (event) => {
  const io = getIO();

  io.emit("eventCreated", event);
};

export const emitEventUpdated = (event) => {
  const io = getIO();

  io.emit("eventUpdated", event);
};

export const emitEventDeleted = (eventId) => {
  const io = getIO();

  io.emit("eventDeleted", eventId);
};





export const emitBookingCreated = ({
  booking,
  recipients,
}) => {
  const io = getIO();

  recipients.forEach((userId) => {
    const socketId = onlineUsers.get(
      userId.toString()
    );

    if (socketId) {
      io.to(socketId).emit(
        "bookingCreated",
        booking
      );
    }
  });
};

export const emitBookingUpdated = ({
  booking,
  recipients,
}) => {
  const io = getIO();

  recipients.forEach((userId) => {
    const socketId = onlineUsers.get(
      userId.toString()
    );

    if (socketId) {
      io.to(socketId).emit(
        "bookingUpdated",
        booking
      );
    }
  });
};

export const emitBookingDeleted = ({
  bookingId,
  recipients,
}) => {
  const io = getIO();

  recipients.forEach((userId) => {
    const socketId = onlineUsers.get(
      userId.toString()
    );

    if (socketId) {
      io.to(socketId).emit(
        "bookingDeleted",
        bookingId
      );
    }
  });
};