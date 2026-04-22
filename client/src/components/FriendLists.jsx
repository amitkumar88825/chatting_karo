import React, { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaCircle, FaCog , FaRegSmile } from "react-icons/fa";

const FriendLists = ({ onSelectFriend, selectedFriend, currentUser, setIsAddFriendOpen, setIsOpenMyProfile }) => {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);

    // Fake friends data
  const fakeFriends = [
    {      _id: "1",
      username: "Alice Johnson",
      email: "alice@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Alice&background=3b82f6&color=fff",
      lastMessage: "Hey! How are you doing today?",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      status: "online",
      lastSeen: "Online now"
    },
    {
      _id: "2",
      username: "Bob Smith",
      email: "bob@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Bob&background=8b5cf6&color=fff",
      lastMessage: "See you tomorrow at the meeting!",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      status: "offline",
      lastSeen: "Last seen 1 hour ago"
    },
    {
      _id: "3",
      username: "Charlie Brown",
      email: "charlie@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Charlie&background=10b981&color=fff",
      lastMessage: "Thanks for your help on the project",
      lastMessageTime: "Yesterday",
      unreadCount: 1,
      status: "online",
      lastSeen: "Online now"
    },
    {
      _id: "4",
      username: "Diana Prince",
      email: "diana@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Diana&background=ef4444&color=fff",
      lastMessage: "Let's catch up soon! Miss you!",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      status: "away",
      lastSeen: "Last seen 2 hours ago"
    },
    {
      _id: "5",
      username: "Ethan Hunt",
      email: "ethan@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Ethan&background=f59e0b&color=fff",
      lastMessage: "Mission accomplished! 🎉",
      lastMessageTime: "2 days ago",
      unreadCount: 0,
      status: "offline",
      lastSeen: "Last seen yesterday"
    },
    {
      _id: "6",
      username: "Fiona Gallagher",
      email: "fiona@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Fiona&background=06b6d4&color=fff",
      lastMessage: "Can you send me the documents?",
      lastMessageTime: "3 days ago",
      unreadCount: 3,
      status: "online",
      lastSeen: "Online now"
    },
    {
      _id: "7",
      username: "George Wilson",
      email: "george@example.com",
      profilePic: "https://ui-avatars.com/api/?name=George&background=ec4899&color=fff",
      lastMessage: "Happy Birthday! 🎂",
      lastMessageTime: "5 days ago",
      unreadCount: 0,
      status: "offline",
      lastSeen: "Last seen 3 days ago"
    },
    {
      _id: "8",
      username: "Hannah Baker",
      email: "hannah@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Hannah&background=14b8a6&color=fff",
      lastMessage: "Did you watch the new movie?",
      lastMessageTime: "1 week ago",
      unreadCount: 0,
      status: "away",
      lastSeen: "Last seen 5 hours ago"
    },
    {
      _id: "9",
      username: "Ian Malcolm",
      email: "ian@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Ian&background=6366f1&color=fff",
      lastMessage: "Life finds a way... 🦕",
      lastMessageTime: "1 week ago",
      unreadCount: 0,
      status: "online",
      lastSeen: "Online now"
    },
    {
      _id: "10",
      username: "Julia Roberts",
      email: "julia@example.com",
      profilePic: "https://ui-avatars.com/api/?name=Julia&background=dc2626&color=fff",
      lastMessage: "See you at the party! 🎉",
      lastMessageTime: "2 weeks ago",
      unreadCount: 0,
      status: "offline",
      lastSeen: "Last seen 1 day ago"
    }
  ];

  useEffect(() => {
    fetchFriends();
    // Simulate online users (you can replace with WebSocket later)
    const online = ["1", "3", "5"];
    setOnlineUsers(online);
  }, []);

  const fetchFriends = async () => {
    try {
    //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    //   const response = await axios.get("http://localhost:5000/api/friends", {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   setFriends(response.data.friends);
    setFriends(fakeFriends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      // Demo data for testing
      setFriends([
        {
          _id: "1",
          username: "Alice Johnson",
          email: "alice@example.com",
          profilePic: "https://ui-avatars.com/api/?name=Alice&background=3b82f6&color=fff",
          lastMessage: "Hey! How are you?",
          lastMessageTime: "2 min ago",
          unreadCount: 2
        },
        {
          _id: "2",
          username: "Bob Smith",
          email: "bob@example.com",
          profilePic: "https://ui-avatars.com/api/?name=Bob&background=8b5cf6&color=fff",
          lastMessage: "See you tomorrow!",
          lastMessageTime: "1 hour ago",
          unreadCount: 0
        },
        {
          _id: "3",
          username: "Charlie Brown",
          email: "charlie@example.com",
          profilePic: "https://ui-avatars.com/api/?name=Charlie&background=10b981&color=fff",
          lastMessage: "Thanks for the help",
          lastMessageTime: "Yesterday",
          unreadCount: 1
        },
        {
          _id: "4",
          username: "Diana Prince",
          email: "diana@example.com",
          profilePic: "https://ui-avatars.com/api/?name=Diana&background=ef4444&color=fff",
          lastMessage: "Let's catch up soon!",
          lastMessageTime: "Yesterday",
          unreadCount: 0
        },
        {
          _id: "5",
          username: "Ethan Hunt",
          email: "ethan@example.com",
          profilePic: "https://ui-avatars.com/api/?name=Ethan&background=f59e0b&color=fff",
          lastMessage: "Mission accomplished",
          lastMessageTime: "2 days ago",
          unreadCount: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3" onClick={() => setIsOpenMyProfile(true)} style={{ cursor: "pointer" }}>
            <img 
              src={currentUser?.profilePic || "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-white font-semibold">{currentUser?.username || "User"}</h2>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition">
            <FaCog  className="text-xl" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredFriends.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => onSelectFriend(friend)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-gray-700 ${
                  selectedFriend?._id === friend._id ? 'bg-gray-700' : ''
                }`}
              >
                {/* Profile Picture */}
                <div className="relative">
                  <img
                    src={friend.profilePic}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full"
                  />
                  {onlineUsers.includes(friend._id) && (
                    <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs" />
                  )}
                </div>

                {/* Friend Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-white font-medium truncate">{friend.username}</h3>
                    <span className="text-xs text-gray-400">{friend.lastMessageTime}</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{friend.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {friend.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friend.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaRegSmile className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No friends found</p>
            <button className="mt-3 text-blue-500 text-sm hover:text-blue-400">
              Add Friends <FaUserPlus className="inline ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Add Friend Button */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
          onClick={() => setIsAddFriendOpen(true)}  >
          <FaUserPlus />
          Add New Friend
        </button>
      </div>
    </div>
  );
};

export default FriendLists;