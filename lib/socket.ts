import { io } from "socket.io-client";

const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v\d+\/?$/, "") ||
  process.env.NEXT_PUBLIC_API ||
  "http://localhost:5000";

export const socket = io(socketUrl, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});
