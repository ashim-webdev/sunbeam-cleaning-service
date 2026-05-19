import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8800"
    : "https://your-backend-url.com";

export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  // autoConnect: true,
});