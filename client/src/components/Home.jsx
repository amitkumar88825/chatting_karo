import React, { useState } from "react";
import FriendLists from "./FriendLists";
import ChatRoom from "./chat-room/ChatRoom";
import { FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddFriend from "./AddFriend";
import MyProfile from "./MyProfile";

const Home = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [ isOpenMyProfile, setIsOpenMyProfile] = useState(false);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Friend Lists */}
        <div className={`
          ${isMobileMenuOpen ? 'fixed inset-0 z-50 w-full' : 'hidden md:block md:w-80 lg:w-96'}
          md:relative md:z-0 bg-gray-800 border-r border-gray-700
        `}>
          <div className="h-full flex flex-col">            
            {/* Friend Lists Component */}
            <div className="flex-1 overflow-y-auto">
              <FriendLists 
                onSelectFriend={handleSelectFriend}
                selectedFriend={selectedFriend}
                currentUser={currentUser}
                setIsAddFriendOpen={setIsAddFriendOpen}
                setIsOpenMyProfile={setIsOpenMyProfile}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {selectedFriend ? (
            <>
              {/* Chat Room */}
              <div className="flex-1 overflow-y-auto">
                <ChatRoom 
                  selectedFriend={selectedFriend}
                  currentUser={currentUser}
                />
              </div>
            </>
          ) : (
            // No Friend Selected State
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaComments className="text-4xl text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Welcome to ChattingKaro</h3>
                <p className="text-gray-500">Select a friend to start chatting</p>
                <button 
                  onClick={() => setIsAddFriendOpen(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Add Friends
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      { isOpenMyProfile && (
        <MyProfile  currentUser={currentUser} onClose={() => setIsOpenMyProfile(false)} />
      )}

      {/* Add Friend Modal */}
      {isAddFriendOpen && (
        <AddFriend onClose={() => setIsAddFriendOpen(false)} />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;