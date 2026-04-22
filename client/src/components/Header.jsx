import React, { useState } from "react";
import { FaPhone, FaVideo, FaInfoCircle, FaEllipsisV, FaArrowLeft, FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";

const Header = ({ selectedFriend, currentUser, onLogout, onMenuClick, onCloseMobile }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (selectedFriend) {
    // Chat Header
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaBars />
          </button>
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
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition">
            <FaPhone className="text-lg" />
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <FaVideo className="text-lg" />
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <FaInfoCircle className="text-lg" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-white transition"
            >
              <FaEllipsisV className="text-lg" />
            </button>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg transition flex items-center gap-2">
                    <FaUser /> View Profile
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg transition flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Header
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <button 
          onClick={onCloseMobile}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <FaArrowLeft />
        </button>
        <img
          src={currentUser?.profilePic || "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff"}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-white font-semibold">{currentUser?.username || "User"}</h2>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-400 hover:text-white transition"
        >
          <FaEllipsisV className="text-lg" />
        </button>
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg transition flex items-center gap-2">
                <FaUser /> My Profile
              </button>
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg transition flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;