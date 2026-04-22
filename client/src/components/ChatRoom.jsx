import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  FaPaperPlane, 
  FaSmile, 
  FaPaperclip, 
  FaMicrophone,
  FaPhone,
  FaVideo,
  FaUsers,
  FaEllipsisV
} from "react-icons/fa";
import api from "../utils/api";
import socket from "../utils/socket";

const ChatRoom = ({ selectedFriend, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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
      // Re-join room if we have one
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
        
        // Listen for join confirmation
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
      console.log("Current room ID:", activeRoomId);
      console.log("Message room ID:", newMessage.roomId);
      
      // Check if message belongs to current room
      if (newMessage.roomId === activeRoomId) {
        setMessages((prev) => {
          // Check if message already exists
          const messageExists = prev.some(msg => msg._id === newMessage._id);
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
  }, [activeRoomId]); // Add activeRoomId as dependency

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
      _id: tempId
    };

    console.log("📤 Sending message to server:", messageData);
    
    // Emit to socket
    socket.emit("send_message", messageData);
    
    // Clear input field
    setNewMessage("");
    setIsSending(false);
    
    // Focus back on input
    inputRef.current?.focus();
  };

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    if (!selectedFriend?._id) return;
    
    setLoading(true);
    try {
      // Try to fetch messages from API if endpoint exists
      const response = await api.get(`/messages/${selectedFriend._id}`).catch(() => null);
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
      setMessages([]); // Clear messages when switching friends
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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
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
              <h2 className="text-white font-semibold">{selectedFriend.username}</h2>
              <p className="text-xs text-green-400">
                {isConnected ? "Online" : "Connecting..."}
              </p>
              {activeRoomId && (
                <p className="text-xs text-gray-400">Room: {activeRoomId.slice(-6)}</p>
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
              className={`flex ${message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.senderId === currentUser?._id ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg px-4 py-2`}>
                <p className="text-white break-words">{message.text || message.message}</p>
                <p className="text-xs text-gray-300 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start a conversation with {selectedFriend.username}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-white transition"
          >
            <FaSmile className="text-xl" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition"
          >
            <FaPaperclip className="text-xl" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSending}
          />
          <button
            type="button"
            className="text-gray-400 hover:text-white transition md:hidden"
          >
            <FaMicrophone className="text-xl" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;