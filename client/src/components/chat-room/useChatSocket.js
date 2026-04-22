import { useEffect, useState, useCallback } from "react";
import socket from "../../utils/socket";

export const useChatSocket = (currentUser, activeRoomId, onReceiveMessage) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Register user on mount and reconnect
  useEffect(() => {
    if (currentUser?._id && socket) {
      socket.emit("register_user", currentUser._id);
    }
  }, [currentUser]);

  // Connection status listeners
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      if (currentUser?._id) socket.emit("register_user", currentUser._id);
      if (activeRoomId) socket.emit("join_room", activeRoomId);
    };
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [currentUser, activeRoomId]);

  // Join/leave room when activeRoomId changes
  useEffect(() => {
    if (activeRoomId && socket && isConnected) {
      socket.emit("join_room", activeRoomId);
      return () => {
        socket.emit("leave_room", activeRoomId);
      };
    }
  }, [activeRoomId, isConnected]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => {
      if (newMessage.roomId === activeRoomId) {
        onReceiveMessage?.(newMessage);
      }
    };
    socket.on("receive_message", handler);
    return () => socket.off("receive_message", handler);
  }, [activeRoomId, onReceiveMessage]);

  // ✅ Updated sendMessage to accept a callback and handle server acknowledgement
  const sendMessage = useCallback((messageData, callback) => {
    if (socket && isConnected) {
      // The server expects a callback (ack) after saving the message
      socket.emit("send_message", messageData, (response) => {
        if (response?.status === "ok") {
          // Message was saved successfully on the server
          console.log("Message saved, server ID:", response.messageId);
          callback?.(null, response);
        } else {
          // Saving failed – let the caller handle retry or show error
          const error = new Error(response?.message || "Failed to save message");
          callback?.(error, response);
        }
      });
    } else {
      const error = new Error("Socket not connected");
      callback?.(error);
    }
  }, [isConnected]);

  return { isConnected, sendMessage };
};