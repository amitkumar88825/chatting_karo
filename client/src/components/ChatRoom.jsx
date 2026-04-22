import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";

const ChatRoom = ({ selectedFriend, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages();
      scrollToBottom();
    }
  }, [selectedFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/messages/${selectedFriend._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Demo messages for testing
      setMessages([
        {
          _id: "1",
          senderId: selectedFriend._id,
          senderName: selectedFriend.username,
          text: "Hey! How are you?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "text"
        },
        {
          _id: "2",
          senderId: currentUser?._id || "current",
          senderName: currentUser?.username || "Me",
          text: "I'm good! How about you?",
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          type: "text"
        },
        {
          _id: "3",
          senderId: selectedFriend._id,
          senderName: selectedFriend.username,
          text: "Doing great! Want to catch up later?",
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          type: "text"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageObj = {
      senderId: currentUser?._id || "current",
      senderName: currentUser?.username || "Me",
      receiverId: selectedFriend._id,
      text: newMessage,
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages([...messages, { ...messageObj, _id: Date.now().toString() }]);
    setNewMessage("");
    inputRef.current?.focus();

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("http://localhost:5000/api/messages/send", 
        { receiverId: selectedFriend._id, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
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
    // Implement actual audio call logic here
  };

  const handleVideoCall = () => {
    alert(`Starting video call with ${selectedFriend.username}...`);
    // Implement actual video call logic here
  };

  const handleGroupCall = () => {
    alert(`Starting group call with ${selectedFriend.username} and others...`);
    // Implement actual group call logic here
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat Header inside ChatRoom with Call Icons */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedFriend.profilePic}
              alt={selectedFriend.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-white font-semibold">{selectedFriend.username}</h2>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          
          {/* Call Icons Section */}
          <div className="flex items-center gap-3">
            {/* Audio Call Icon */}
            <button
              onClick={handleAudioCall}
              className="text-gray-400 hover:text-green-500 transition-all hover:scale-110 p-2 rounded-full hover:bg-gray-700"
              title="Audio Call"
            >
              <FaPhone className="text-lg" />
            </button>

            {/* Video Call Icon */}
            <button
              onClick={handleVideoCall}
              className="text-gray-400 hover:text-blue-500 transition-all hover:scale-110 p-2 rounded-full hover:bg-gray-700"
              title="Video Call"
            >
              <FaVideo className="text-lg" />
            </button>

            {/* Group Call Icon */}
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
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.senderId === (currentUser?._id || "current") ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.senderId === (currentUser?._id || "current") ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg px-4 py-2`}>
                <p className="text-white break-words">{message.text}</p>
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
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="text-gray-400 hover:text-white transition md:hidden"
          >
            <FaMicrophone className="text-xl" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim()}
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