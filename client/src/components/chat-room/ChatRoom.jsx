import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaMicrophone,
  FaPhone,
  FaVideo,
  FaUsers,
  FaEllipsisV,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import api from "../../utils/api";
import socket from "../../utils/socket";
import GifPicker from "../ui/GifPicker";

const ChatRoom = ({ selectedFriend, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Register user with socket
  useEffect(() => {
    if (currentUser?._id && socket) {
      socket.emit("register_user", currentUser._id);
      console.log("📝 Registered user with socket:", currentUser._id);
    }
  }, [currentUser]);

  // Socket connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Socket connected with ID:", socket.id);
      setIsConnected(true);
      if (currentUser?._id) {
        socket.emit("register_user", currentUser._id);
      }
      if (activeRoomId) {
        console.log("🔄 Re-joining room after reconnect:", activeRoomId);
        socket.emit("join_room", activeRoomId);
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [currentUser, activeRoomId]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch active room ID
  const fetchActiveRoomId = useCallback(async () => {
    if (!selectedFriend?._id) return;

    try {
      const res = await api.get(`/rooms/active/${selectedFriend._id}`);
      console.log("🏠 Active Room ID fetched:", res.data.roomId);
      setActiveRoomId(res.data.roomId);
      return res.data.roomId;
    } catch (error) {
      console.error("Error fetching active room ID:", error);
    }
  }, [selectedFriend]);

  // Join room when activeRoomId is available
  useEffect(() => {
    const setupRoom = async () => {
      const roomId = await fetchActiveRoomId();
      if (roomId && socket && isConnected) {
        console.log("🔗 Joining room:", roomId);
        socket.emit("join_room", roomId);

        const handleJoinedRoom = (data) => {
          console.log("✅ Successfully joined room:", data);
        };

        socket.once("joined_room", handleJoinedRoom);
      }
    };

    setupRoom();

    return () => {
      if (activeRoomId && socket) {
        console.log("🚪 Leaving room:", activeRoomId);
        socket.emit("leave_room", activeRoomId);
      }
    };
  }, [fetchActiveRoomId, isConnected]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      console.log("📨 Received message from server:", newMessage);
      if (newMessage.roomId === activeRoomId) {
        setMessages((prev) => {
          const messageExists = prev.some((msg) => msg._id === newMessage._id);
          if (messageExists) {
            console.log("⚠️ Message already exists, skipping");
            return prev;
          }
          console.log("✅ Adding new message to state");
          return [...prev, newMessage];
        });
      } else {
        console.log("⚠️ Message received for different room, ignoring");
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    console.log("👂 Listening for receive_message events");

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeRoomId]);

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const cursorPosition = inputRef.current?.selectionStart || newMessage.length;
    const newText =
      newMessage.slice(0, cursorPosition) +
      emoji +
      newMessage.slice(cursorPosition);

    setNewMessage(newText);
    inputRef.current?.focus();

    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = cursorPosition + emoji.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Send message function
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) {
      console.log("❌ Cannot send: empty message or already sending");
      return;
    }

    if (!activeRoomId) {
      console.error("❌ No active room ID available");
      alert("Please wait, connecting to chat room...");
      return;
    }

    if (!isConnected) {
      console.error("❌ Socket not connected");
      alert("Connecting to server... Please try again in a moment.");
      return;
    }

    setIsSending(true);

    const messageText = newMessage.trim();
    const tempId = `${Date.now()}_${currentUser._id}`;

    const messageData = {
      roomId: activeRoomId,
      senderId: currentUser._id,
      message: messageText,
      text: messageText,
      timestamp: new Date(),
      _id: tempId,
      type: "text",
    };

    console.log("📤 Sending message to server:", messageData);

    socket.emit("send_message", messageData);

    setNewMessage("");
    setIsSending(false);
    inputRef.current?.focus();
  };

  const sendGif = (gifUrl) => {
    if (!activeRoomId || !isConnected) return;

    const messageData = {
      roomId: activeRoomId,
      senderId: currentUser._id,
      type: "gif",
      content: gifUrl,
      timestamp: new Date(),
      _id: `${Date.now()}_${currentUser._id}`,
    };

    socket.emit("send_message", messageData);
    setShowGifPicker(false);
  };

  // Handle file selection and upload
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input so same file can be selected again
    fileInputRef.current.value = "";

    // Validate file size (e.g., max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert("File size exceeds 50MB limit.");
      return;
    }

    if (!activeRoomId || !isConnected) {
      alert("Chat connection not ready. Please try again.");
      return;
    }

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", activeRoomId);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const { fileUrl, fileName, fileSize, mimeType } = response.data;

      // Determine message type based on mime
      let messageType = "file";
      if (mimeType.startsWith("image/")) messageType = "image";
      else if (mimeType.startsWith("video/")) messageType = "video";
      else if (mimeType.startsWith("audio/")) messageType = "audio";

      const messageData = {
        roomId: activeRoomId,
        senderId: currentUser._id,
        type: messageType,
        content: {
          url: fileUrl,
          fileName,
          fileSize,
          mimeType,
        },
        timestamp: new Date(),
        _id: `${Date.now()}_${currentUser._id}`,
      };

      socket.emit("send_message", messageData);
    } catch (error) {
      console.error("File upload failed:", error);
      alert(error.response?.data?.message || "Failed to upload file. Please try again.");
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  // Trigger file input
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    if (!selectedFriend?._id) return;

    setLoading(true);
    try {
      const response = await api
        .get(`/messages/${selectedFriend._id}`)
        .catch(() => null);
      if (response && response.data) {
        console.log("📚 Loaded messages from API:", response.data.length);
        setMessages(response.data);
      } else {
        console.log("📚 No messages from API, starting fresh");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (selectedFriend) {
      console.log("👤 Selected friend changed:", selectedFriend.username);
      setMessages([]);
      fetchMessages();
    }
  }, [selectedFriend, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Render file message content
  const renderFileContent = (message) => {
    const { content, type } = message;
    
    // Handle old format where content might be a string URL
    const fileData = typeof content === "string" 
      ? { url: content, fileName: "file", mimeType: type }
      : content;

    const { url, fileName, mimeType, fileSize } = fileData;

    // Image preview
    if (type === "image" || (mimeType && mimeType.startsWith("image/"))) {
      return (
        <div className="max-w-xs">
          <img
            src={url}
            alt={fileName}
            className="rounded-lg max-w-full cursor-pointer hover:opacity-90"
            onClick={() => window.open(url, "_blank")}
          />
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }

    // Video preview
    if (type === "video" || (mimeType && mimeType.startsWith("video/"))) {
      return (
        <div className="max-w-xs">
          <video controls className="rounded-lg max-w-full">
            <source src={url} type={mimeType} />
            Your browser does not support the video tag.
          </video>
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }

    // Audio preview
    if (type === "audio" || (mimeType && mimeType.startsWith("audio/"))) {
      return (
        <div className="max-w-xs">
          <audio controls className="w-full">
            <source src={url} type={mimeType} />
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }

    // Document/file with icon
    const getFileIcon = () => {
      if (mimeType?.includes("pdf")) return <FaFilePdf className="text-red-400 text-2xl" />;
      if (mimeType?.includes("word") || mimeType?.includes("document")) return <FaFileWord className="text-blue-400 text-2xl" />;
      if (mimeType?.includes("excel") || mimeType?.includes("spreadsheet")) return <FaFileExcel className="text-green-400 text-2xl" />;
      if (mimeType?.includes("zip") || mimeType?.includes("compressed") || mimeType?.includes("archive")) return <FaFileArchive className="text-yellow-400 text-2xl" />;
      if (mimeType?.startsWith("image/")) return <FaFileImage className="text-purple-400 text-2xl" />;
      return <FaFileAlt className="text-gray-400 text-2xl" />;
    };

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition max-w-xs"
        download={fileName}
      >
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate">{fileName}</p>
          {fileSize && (
            <p className="text-xs text-gray-300">{formatFileSize(fileSize)}</p>
          )}
        </div>
        <FaFile className="text-gray-300" />
      </a>
    );
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "gif":
        return (
          <img
            src={message.content}
            alt="gif"
            className="w-40 rounded-lg"
          />
        );
      case "image":
      case "video":
      case "audio":
      case "file":
        return renderFileContent(message);
      default:
        return (
          <p className="text-white break-words text-base">
            {message.text || message.message}
          </p>
        );
    }
  };

  // Call handlers
  const handleAudioCall = () => {
    alert(`Starting audio call with ${selectedFriend.username}...`);
  };

  const handleVideoCall = () => {
    alert(`Starting video call with ${selectedFriend.username}...`);
  };

  const handleGroupCall = () => {
    alert(`Starting group call with ${selectedFriend.username} and others...`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept="*/*"
      />

      {/* Chat Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedFriend.profilePic || "/default-avatar.png"}
              alt={selectedFriend.username}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <h2 className="text-white font-semibold">
                {selectedFriend.username}
              </h2>
              <p className="text-xs text-green-400">
                {isConnected ? "Online" : "Connecting..."}
              </p>
              {activeRoomId && (
                <p className="text-xs text-gray-400">
                  Room: {activeRoomId.slice(-6)}
                </p>
              )}
            </div>
          </div>

          {/* Call Icons Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAudioCall}
              className="text-gray-400 hover:text-green-500 transition-all hover:scale-110 p-2 rounded-full hover:bg-gray-700"
              title="Audio Call"
            >
              <FaPhone className="text-lg" />
            </button>

            <button
              onClick={handleVideoCall}
              className="text-gray-400 hover:text-blue-500 transition-all hover:scale-110 p-2 rounded-full hover:bg-gray-700"
              title="Video Call"
            >
              <FaVideo className="text-lg" />
            </button>

            <button
              onClick={handleGroupCall}
              className="text-gray-400 hover:text-purple-500 transition-all hover:scale-110 p-2 rounded-full hover:bg-gray-700"
              title="Group Call"
            >
              <FaUsers className="text-lg" />
            </button>

            {/* Menu Icon */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-white transition-all p-2 rounded-full hover:bg-gray-700"
              >
                <FaEllipsisV className="text-lg" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg transition">
                      View Contact
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition">
                      Clear Chat
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition">
                      Block User
                    </button>
                    <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg transition">
                      Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`flex ${message.senderId === currentUser?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${message.senderId === currentUser?._id ? "bg-blue-600" : "bg-gray-700"} rounded-lg px-4 py-2`}
              >
                {renderMessageContent(message)}
                <p className="text-xs text-gray-300 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No messages yet</p>
            <p className="text-sm mt-2">
              Start a conversation with {selectedFriend.username}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input with Emoji Picker and Upload Progress */}
      <div className="relative">
        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full mb-2 left-0 z-50"
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: "10px",
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              theme="dark"
              width={350}
              height={400}
              searchPlaceholder="Search emojis..."
              lazyLoadEmojis={true}
            />
          </div>
        )}

        {showGifPicker && (
          <div className="absolute bottom-full mb-2 left-12 z-50">
            <GifPicker onSelect={sendGif} />
          </div>
        )}

        {/* Upload progress indicator */}
        {uploadingFile && (
          <div className="absolute bottom-full mb-2 left-0 right-0 z-50 px-4">
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={sendMessage}
          className="bg-gray-800 p-4 border-t border-gray-700"
        >
          <div className="flex items-center gap-2">
            {/* Emoji Button */}
            <button
              type="button"
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white transition transform hover:scale-110"
              title="Emoji"
            >
              <FaSmile className="text-xl" />
            </button>

            <button
              type="button"
              onClick={() => setShowGifPicker(!showGifPicker)}
              className="text-gray-400 hover:text-white transition transform hover:scale-110"
              title="GIF"
            >
              GIF
            </button>

            {/* Attachment Button */}
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="text-gray-400 hover:text-white transition transform hover:scale-110"
              title="Attach File"
              disabled={uploadingFile}
            >
              <FaPaperclip className="text-xl" />
            </button>

            {/* Message Input */}
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending || uploadingFile}
            />

            {/* Microphone Button (Mobile) */}
            <button
              type="button"
              className="text-gray-400 hover:text-white transition md:hidden transform hover:scale-110"
              title="Voice Message"
            >
              <FaMicrophone className="text-xl" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending || uploadingFile}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              title="Send Message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;