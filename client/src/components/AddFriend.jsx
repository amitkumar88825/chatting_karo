import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sendingRequests, setSendingRequests] = useState({});
  const [cancellingRequests, setCancellingRequests] = useState({});
  const [acceptingRequests, setAcceptingRequests] = useState({});
  const [rejectingRequests, setRejectingRequests] = useState({});
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const observerRef = useRef();
  const lastElementRef = useRef();
  const currentUser = useSelector((state) => state.user.user);

  const fetchAllUsers = async (pageNum = 1, reset = false, search = searchTerm) => {
    if (loadingMore && !reset) return;
    
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await api.get("/users/all", {
        params: {
          page: pageNum,
          limit: 20,
          search: search || undefined,
        },
      });

      const { users, sentRequests: sent, receivedRequests: received, pagination } = response.data;

      const newUsers = users || [];
      const newSentRequests = sent || [];
      const newReceivedRequests = received || [];

      if (reset) {
        // Reset everything properly
        setAllUsers(newUsers);
        setSentRequests(newSentRequests);
        setReceivedRequests(newReceivedRequests);
        setFilteredUsers(newUsers);
        setTotalCount(pagination.totalItems || 0);
      } else {
        // Append only USERS (not requests)
        setAllUsers(prev => [...prev, ...newUsers]);
        setFilteredUsers(prev => [...prev, ...newUsers]);
        // Also update sent/received requests (but don't duplicate)
        setSentRequests(prev => {
          const existingIds = new Set(prev.map(r => r._id));
          const uniqueNew = newSentRequests.filter(r => !existingIds.has(r._id));
          return [...prev, ...uniqueNew];
        });
        setReceivedRequests(prev => {
          const existingIds = new Set(prev.map(r => r._id));
          const uniqueNew = newReceivedRequests.filter(r => !existingIds.has(r._id));
          return [...prev, ...uniqueNew];
        });
      }

      // Fix pagination logic
      const hasNextPage = pagination.currentPage < pagination.totalPages;
      setHasMore(hasNextPage);
      setTotalPages(pagination.totalPages);
      setPage(pageNum);
      setInitialDataLoaded(true);

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const filterData = useCallback(() => {
    let data = [];

    if (activeTab === "all") {
      data = allUsers;
    } else if (activeTab === "sent") {
      data = sentRequests;
    } else if (activeTab === "received") {
      data = receivedRequests;
    }

    const filtered = data.filter((user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [activeTab, searchTerm, allUsers, sentRequests, receivedRequests]);

  // Initial data load
  useEffect(() => {
    fetchAllUsers(1, true);
  }, []);

  // Filter when dependencies change
  useEffect(() => {
    if (initialDataLoaded) {
      filterData();
    }
  }, [filterData, initialDataLoaded]);

  // Reset and fetch when search term changes (with debounce)
  useEffect(() => {
    if (!initialDataLoaded) return;
    
    const debounceTimer = setTimeout(() => {
      if (activeTab === "all") {
        // For all users tab, fetch from API with search
        fetchAllUsers(1, true, searchTerm);
      } else {
        // For sent/received tabs, just filter locally
        filterData();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Reset when tab changes
  useEffect(() => {
    if (!initialDataLoaded) return;
    setSearchTerm("");
    // Re-fetch when switching to all tab to reset pagination state
    if (activeTab === "all") {
      fetchAllUsers(1, true, "");
    } else {
      filterData();
    }
  }, [activeTab]);

  // Intersection Observer for infinite scrolling (only for all users tab)
  useEffect(() => {
    if (!initialDataLoaded) return;
    if (loadingMore || !hasMore || activeTab !== "all" || searchTerm) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && activeTab === "all") {
          const nextPage = page + 1;
          if (nextPage <= totalPages) {
            fetchAllUsers(nextPage, false, searchTerm);
          }
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }
    
    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
      observer.disconnect();
    };
  }, [loadingMore, hasMore, page, activeTab, searchTerm, totalPages, initialDataLoaded]);

  const sendFriendRequest = async (userId) => { 
    setSendingRequests(prev => ({ ...prev, [userId]: true }));
    
    try {
      await api.post("users/sent-request", { friendId: userId });
      
      // Update local state optimistically
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, requestSent: true, isFollowing: true } : user
      ));
      
      // Update sent requests list
      const userToAdd = allUsers.find(u => u._id === userId);
      if (userToAdd) {
        setSentRequests(prev => [...prev, { 
          ...userToAdd, 
          requestSent: true, 
          createdAt: new Date(),
          requestId: Date.now().toString()
        }]);
      }
      
      // Update filtered users
      filterData();
      
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
      
      // Update local state optimistically
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, requestSent: false, isFollowing: false } : user
      ));
      
      // Remove from sent requests
      setSentRequests(prev => prev.filter(req => req._id !== requestId && req._id !== userId));
      
      // Update filtered users
      filterData();
      
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
      setReceivedRequests(prev => prev.filter(req => req._id !== requestId && req._id !== userId));
      
      // Update all users - remove from received list
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, requestReceived: false } : user
      ));
      
      // Update filtered users
      filterData();
      
      alert("Friend request accepted successfully!");
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
      setReceivedRequests(prev => prev.filter(req => req._id !== requestId && req._id !== userId));
      
      // Update all users
      setAllUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, requestReceived: false } : user
      ));
      
      // Update filtered users
      filterData();
      
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
            {isSentRequest && user.createdAt && (
              <div className="flex items-center gap-1 mt-2 text-xs text-yellow-500">
                <FaClock className="text-xs" />
                <span>Request sent {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            
            {isReceivedRequest && user.createdAt && (
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-500">
                <FaClock className="text-xs" />
                <span>Request received {new Date(user.createdAt).toLocaleDateString()}</span>
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
                disabled={sendingRequests[user._id] || user.requestSent}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {sendingRequests[user._id] ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Sending...
                  </>
                ) : user.requestSent ? (
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
        {!isSentRequest && !isReceivedRequest && !user.requestSent && activeTab === "all" && (
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
          {totalCount > 0 && activeTab === "all" && (
            <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
              {totalCount} users
            </span>
          )}
        </div>

        {/* Tabs and Search Bar */}
        <div className="p-4 border-b border-gray-800 bg-gray-800/50">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaUserFriends />
              All Users
              {hasMore && activeTab === "all" && !searchTerm && (
                <span className="text-xs ml-1 text-gray-400">(Infinite)</span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("sent")}
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
              onClick={() => setActiveTab("received")}
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

        {/* Users/Requests List with Infinite Scrolling */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              {filteredUsers.map((user, index) => {
                // Add ref to last element for infinite scrolling (only for all users tab without search)
                if (index === filteredUsers.length - 1 && activeTab === "all" && !searchTerm && hasMore) {
                  return (
                    <div ref={lastElementRef} key={user._id}>
                      {renderUserCard(user, activeTab)}
                    </div>
                  );
                } else {
                  return (
                    <div key={user._id}>
                      {renderUserCard(user, activeTab)}
                    </div>
                  );
                }
              })}
              
              {/* Loading more indicator */}
              {loadingMore && activeTab === "all" && (
                <div className="flex justify-center items-center py-4">
                  <FaSpinner className="text-2xl text-blue-500 animate-spin" />
                  <span className="ml-2 text-gray-400">Loading more users...</span>
                </div>
              )}
              
              {/* No more users message */}
              {!hasMore && activeTab === "all" && filteredUsers.length > 0 && !searchTerm && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">You've reached the end! No more users to show.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {activeTab === "all" 
                    ? searchTerm ? "No users found" : "No users available"
                    : activeTab === "sent"
                    ? "No pending friend requests"
                    : "No follow requests"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {activeTab === "all" && searchTerm
                    ? "Try searching with a different username" 
                    : activeTab === "all"
                    ? "Check back later for new users"
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