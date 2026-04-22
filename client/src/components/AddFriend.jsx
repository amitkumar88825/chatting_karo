import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaUserPlus, 
  FaCheck, 
  FaTimes, 
  FaArrowLeft,
  FaUserCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRegHeart,
  FaPaperPlane,
  FaClock,
  FaUserCheck
} from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../utils/api";

const AddFriend = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("all"); // all, sent, received
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequests, setSendingRequests] = useState({});
  const [cancellingRequests, setCancellingRequests] = useState({});
  const [acceptingRequests, setAcceptingRequests] = useState({});
  const [rejectingRequests, setRejectingRequests] = useState({});
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      const filtered = allUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else if (activeTab === "sent") {
      const filtered = sentRequests.filter(request => 
        request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else if (activeTab === "received") {
      const filtered = receivedRequests.filter(request => 
        request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, activeTab, allUsers, sentRequests, receivedRequests]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersRes = await api.get("/users/all");
      setAllUsers(usersRes.data.users || []);
      
      // Fetch sent friend requests
      const sentRes = await api.get("/users/requests-sent");
      setSentRequests(sentRes.data.requests || []);
      
      // Fetch received friend requests
      const receivedRes = await api.get("/users/requests-received");
      setReceivedRequests(receivedRes.data.requests || []);
      
      setFilteredUsers(usersRes.data.users || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllUsers([]);
      setSentRequests([]);
      setReceivedRequests([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    setSendingRequests(prev => ({ ...prev, [userId]: true }));
    
    try {
      await api.post("/friends/request", { friendId: userId });
      
      // Update local state
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: true, requestSent: true } : user
      ));
      
      // Add to sent requests
      const user = allUsers.find(u => u._id === userId);
      if (user) {
        setSentRequests(prev => [...prev, { ...user, requestStatus: "pending" }]);
      }
      
      alert("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    } finally {
      setSendingRequests(prev => ({ ...prev, [userId]: false }));
    }
  };

  const cancelFriendRequest = async (requestId, userId) => {
    setCancellingRequests(prev => ({ ...prev, [requestId]: true }));
    
    try {
      await api.delete(`/friends/request/${requestId}`);
      
      // Remove from sent requests
      setSentRequests(prev => prev.filter(req => req._id !== requestId));
      
      // Update all users
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: false, requestSent: false } : user
      ));
      
      alert("Friend request cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      alert("Failed to cancel friend request. Please try again.");
    } finally {
      setCancellingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const acceptFriendRequest = async (requestId, userId) => {
    setAcceptingRequests(prev => ({ ...prev, [requestId]: true }));
    
    try {
      await api.post(`/friends/request/${requestId}/accept`);
      
      // Remove from received requests
      setReceivedRequests(prev => prev.filter(req => req._id !== requestId));
      
      alert("Friend request accepted successfully!");
      fetchData(); // Refresh all data
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setAcceptingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const rejectFriendRequest = async (requestId, userId) => {
    setRejectingRequests(prev => ({ ...prev, [requestId]: true }));
    
    try {
      await api.delete(`/friends/request/${requestId}`);
      
      // Remove from received requests
      setReceivedRequests(prev => prev.filter(req => req._id !== requestId));
      
      alert("Friend request rejected!");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Failed to reject friend request. Please try again.");
    } finally {
      setRejectingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const formatNumber = (num) => {
    if(!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString() || '0';
  };

  const getTabCount = (tab) => {
    if (tab === "sent") return sentRequests.length;
    if (tab === "received") return receivedRequests.length;
    return allUsers.length;
  };

  const renderUserCard = (user, type) => {
    const isSentRequest = type === "sent";
    const isReceivedRequest = type === "received";
    
    return (
      <div
        key={user._id}
        className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all duration-200 border border-gray-700 hover:border-blue-500/50"
      >
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff&size=128`}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-lg">
                {user.fullName || user.username}
              </h3>
              {user.isVerified && (
                <FaCheck className="text-blue-500 text-sm" />
              )}
              <span className="text-gray-400 text-sm">@{user.username}</span>
            </div>
            
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{user.bio || "No bio yet"}</p>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {user.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-xs" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FaUserCircle className="text-xs" />
                <span>{formatNumber(user.followers)} followers</span>
              </div>
              {user.mutualFriends > 0 && (
                <div className="flex items-center gap-1">
                  <FaUserFriends className="text-xs" />
                  <span>{user.mutualFriends} mutual</span>
                </div>
              )}
            </div>

            {/* Request Info for sent/received tabs */}
            {isSentRequest && user.requestedAt && (
              <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500">
                <FaClock className="text-xs" />
                <span>Request sent {new Date(user.requestedAt).toLocaleDateString()}</span>
              </div>
            )}
            
            {isReceivedRequest && user.requestedAt && (
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-500">
                <FaClock className="text-xs" />
                <span>Request received {new Date(user.requestedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {isSentRequest ? (
              <button
                onClick={() => cancelFriendRequest(user.requestId || user._id, user._id)}
                disabled={cancellingRequests[user.requestId || user._id]}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
              >
                {cancellingRequests[user.requestId || user._id] ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaTimes className="text-sm" />
                    Cancel Request
                  </>
                )}
              </button>
            ) : isReceivedRequest ? (
              <div className="flex gap-2">
                <button
                  onClick={() => acceptFriendRequest(user.requestId || user._id, user._id)}
                  disabled={acceptingRequests[user.requestId || user._id]}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  {acceptingRequests[user.requestId || user._id] ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-sm" />
                      Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => rejectFriendRequest(user.requestId || user._id, user._id)}
                  disabled={rejectingRequests[user.requestId || user._id]}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  {rejectingRequests[user.requestId || user._id] ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes className="text-sm" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => sendFriendRequest(user._id)}
                disabled={sendingRequests[user._id] || user.isFollowing}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {sendingRequests[user._id] ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Sending...
                  </>
                ) : user.isFollowing ? (
                  <>
                    <FaCheck className="text-sm" />
                    Request Sent
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-sm" />
                    Add Friend
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Suggested for you badge (only for all users tab) */}
        {!isSentRequest && !isReceivedRequest && !user.isFollowing && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaRegHeart className="text-white text-xs" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Suggested for you</p>
                  <p className="text-xs text-gray-500">
                    Based on your interests
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h2 className="text-xl font-bold text-white">Add Friends</h2>
          </div>
        </div>

        {/* Tabs and Search Bar */}
        <div className="p-4 border-b border-gray-800 bg-gray-800/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchTerm("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaUserFriends />
              All Users
            </button>
            
            <button
              onClick={() => {
                setActiveTab("sent");
                setSearchTerm("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "sent"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaPaperPlane />
              Sent Requests
              {sentRequests.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "sent" ? "bg-white/20" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {sentRequests.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab("received");
                setSearchTerm("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "received"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaUserCheck />
              Follow Requests
              {receivedRequests.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "received" ? "bg-white/20" : "bg-green-500/20 text-green-400"
                }`}>
                  {receivedRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder={
                activeTab === "all" 
                  ? "Search by username, name or email..." 
                  : activeTab === "sent"
                  ? "Search sent requests..."
                  : "Search follow requests..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Users/Requests List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => renderUserCard(user, activeTab))
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {activeTab === "all" 
                    ? "No users found" 
                    : activeTab === "sent"
                    ? "No pending friend requests"
                    : "No follow requests"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {activeTab === "all" 
                    ? "Try searching with a different username" 
                    : activeTab === "sent"
                    ? "Your sent requests will appear here"
                    : "When someone sends you a request, it will appear here"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-800/50">
          <p className="text-center text-gray-500 text-xs">
            Connect with people you know and expand your network
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;