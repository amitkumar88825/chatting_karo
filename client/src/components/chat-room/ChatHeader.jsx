import React, { useState } from "react";
import { FaPhone, FaVideo, FaUsers, FaEllipsisV } from "react-icons/fa";

const ChatHeader = ({ friend, isConnected, activeRoomId }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAudioCall = () => alert(`Audio call with ${friend.username}...`);
  const handleVideoCall = () => alert(`Video call with ${friend.username}...`);
  const handleGroupCall = () => alert(`Group call with ${friend.username}...`);

  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left: avatar & info */}
        <div className="flex items-center gap-3">
          <img
            src={friend.profilePic || "/default-avatar.png"}
            alt={friend.username}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <div>
            <h2 className="text-white font-semibold">{friend.username}</h2>
            <p className="text-xs text-green-400">
              {isConnected ? "Online" : "Connecting..."}
            </p>
            {activeRoomId && (
              <p className="text-xs text-gray-400">Room: {activeRoomId.slice(-6)}</p>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-3">
          <button onClick={handleAudioCall} className="text-gray-400 hover:text-green-500 p-2 rounded-full hover:bg-gray-700" title="Audio Call">
            <FaPhone className="text-lg" />
          </button>
          <button onClick={handleVideoCall} className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-700" title="Video Call">
            <FaVideo className="text-lg" />
          </button>
          <button onClick={handleGroupCall} className="text-gray-400 hover:text-purple-500 p-2 rounded-full hover:bg-gray-700" title="Group Call">
            <FaUsers className="text-lg" />
          </button>

          {/* Menu dropdown */}
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
              <FaEllipsisV className="text-lg" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg">View Contact</button>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">Clear Chat</button>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">Block User</button>
                  <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg">Report</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;