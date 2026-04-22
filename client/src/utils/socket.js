import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  forceNew: true, // Add this
  path: '/socket.io/' // Add this
});

socket.on("connect", () => {
  console.log("Socket.IO connected with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket.IO reconnected after", attemptNumber, "attempts");
});

export default socket;