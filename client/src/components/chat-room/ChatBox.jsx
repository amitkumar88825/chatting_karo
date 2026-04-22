import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../utils/api";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import FileUploadProgress from "./FileUploadProgress";
import { useChatSocket } from "./useChatSocket";
import { useMessages } from "./useMessages";

const ChatBox = ({ selectedFriend, currentUser }) => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const { messages, loading, fetchMessages, addMessage } = useMessages(selectedFriend);
  const { isConnected, sendMessage } = useChatSocket(currentUser, activeRoomId, addMessage);

  const fetchActiveRoomId = useCallback(async () => {
    if (!selectedFriend?._id) return;
    try {
      const res = await api.get(`/rooms/active/${selectedFriend._id}`);
      setActiveRoomId(res.data.roomId);
    } catch (error) {
      console.error("Error fetching active room ID:", error);
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages();
      fetchActiveRoomId();
    }
  }, [selectedFriend, fetchMessages, fetchActiveRoomId]);

  const handleSendMessage = (text) => {
    if (!activeRoomId || !isConnected) return;
    setIsSending(true);
    const tempId = `${Date.now()}_${currentUser._id}`;
    const messageData = {
      roomId: activeRoomId,
      senderId: currentUser._id,
      message: text,
      text: text,
      timestamp: new Date(),
      _id: tempId,
      type: "text",
    };
    // Optional: add optimistic update for text too
    addMessage(messageData);
    sendMessage(messageData);
    setIsSending(false);
  };

  const handleSendGif = (gifUrl) => {
    if (!activeRoomId || !isConnected) return;
    const messageData = {
      roomId: activeRoomId,
      senderId: currentUser._id,
      type: "gif",
      content: gifUrl,
      timestamp: new Date(),
      _id: `${Date.now()}_${currentUser._id}`,
    };
    addMessage(messageData); // optimistic update
    sendMessage(messageData);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    fileInputRef.current.value = "";
    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }
    if (!activeRoomId || !isConnected) {
      alert("Chat connection not ready.");
      return;
    }

    setUploadingFile(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", activeRoomId);
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      const { fileUrl, fileName, fileSize, mimeType } = response.data;
      let messageType = "file";
      if (mimeType.startsWith("image/")) messageType = "image";
      else if (mimeType.startsWith("video/")) messageType = "video";
      else if (mimeType.startsWith("audio/")) messageType = "audio";

      const tempId = `${Date.now()}_${currentUser._id}_${Math.random()}`;
      const messageData = {
        roomId: activeRoomId,
        senderId: currentUser._id,
        type: messageType,
        content: { url: fileUrl, fileName, fileSize, mimeType },
        timestamp: new Date(),
        _id: tempId,
      };

      addMessage(messageData); // optimistic update
      sendMessage(messageData);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
      <ChatHeader friend={selectedFriend} isConnected={isConnected} activeRoomId={activeRoomId} />
      <MessageList messages={messages} loading={loading} currentUserId={currentUser?._id} friendName={selectedFriend?.username} />
      <FileUploadProgress progress={uploadProgress} />
      <MessageInput
        onSendMessage={handleSendMessage}
        onSendGif={handleSendGif}
        onAttachFile={triggerFileInput}
        isSending={isSending}
        uploadingFile={uploadingFile}
        disabled={!selectedFriend}
      />
    </div>
  );
};

export default ChatBox;