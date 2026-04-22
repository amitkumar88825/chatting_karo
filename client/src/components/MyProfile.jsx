import React, { useState, useRef } from "react";
import { 
  FaArrowLeft, 
  FaCamera, 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaLink,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaComment,
  FaBookmark,
  FaCog,
  FaMoon,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaSpinner,
  FaTrash,
  FaUserCircle
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";

const MyProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || currentUser?.username || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "No bio yet",
    location: currentUser?.location || "",
    website: currentUser?.website || "",
    phone: currentUser?.phone || "",
  });

  const [stats, setStats] = useState({
    posts: 42,
    followers: 12450,
    following: 832,
  });

  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      imageUrl: "https://picsum.photos/300/300?random=1",
      likes: 1234,
      comments: 89,
      caption: "Beautiful day! 🌞",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      imageUrl: "https://picsum.photos/300/300?random=2",
      likes: 2345,
      comments: 156,
      caption: "Adventure time! 🏔️",
      timestamp: "5 days ago"
    },
    {
      id: 3,
      imageUrl: "https://picsum.photos/300/300?random=3",
      likes: 3456,
      comments: 234,
      caption: "Good vibes only ✨",
      timestamp: "1 week ago"
    },
    {
      id: 4,
      imageUrl: "https://picsum.photos/300/300?random=4",
      likes: 4567,
      comments: 345,
      caption: "Living my best life 💫",
      timestamp: "2 weeks ago"
    },
    {
      id: 5,
      imageUrl: "https://picsum.photos/300/300?random=5",
      likes: 5678,
      comments: 456,
      caption: "Sunset lover 🌅",
      timestamp: "3 weeks ago"
    },
    {
      id: 6,
      imageUrl: "https://picsum.photos/300/300?random=6",
      likes: 6789,
      comments: 567,
      caption: "New beginnings 🌱",
      timestamp: "1 month ago"
    }
  ]);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await api.put("/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      dispatch({ type: "user/updateProfilePic", payload: response.data.profilePic });
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile pic:", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await api.put("/users/profile", formData);
      dispatch({ type: "user/updateProfile", payload: response.data.user });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-y-auto">
      <div className="min-h-screen bg-gray-900">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft className="text-2xl" />
              </button>
              <h1 className="text-xl font-bold text-white">
                {isEditing ? "Edit Profile" : currentUser?.username}
              </h1>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <FaEdit className="text-sm" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            
            {/* Profile Picture */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={currentUser?.profilePic || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=3b82f6&color=fff&size=200`}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-700"
                />
                {!isEditing && (
                  <label
                    htmlFor="profile-pic-input"
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition transform hover:scale-110"
                  >
                    <FaCamera className="text-white text-sm" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="profile-pic-input"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <FaSpinner className="text-white text-2xl animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {currentUser?.username}
                </h2>
                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <div className="font-bold text-white">{stats.posts}</div>
                  <div className="text-gray-400 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(stats.followers)}</div>
                  <div className="text-gray-400 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white">{formatNumber(stats.following)}</div>
                  <div className="text-gray-400 text-sm">Following</div>
                </div>
              </div>

              {/* Bio */}
              {!isEditing ? (
                <>
                  <div className="mb-2">
                    <div className="font-semibold text-white">
                      {formData.fullName}
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{formData.bio}</p>
                    {formData.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-1 justify-center md:justify-start">
                        <FaMapMarkerAlt className="text-xs" />
                        <span>{formData.location}</span>
                      </div>
                    )}
                    {formData.website && (
                      <a 
                        href={formData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm hover:underline block mt-1"
                      >
                        {formData.website}
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Bio"
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Website"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-800">
            <div className="flex justify-center gap-12">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-3 px-4 flex items-center gap-2 border-t-2 transition ${
                  activeTab === "posts"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <FaUser className="text-sm" />
                <span className="text-sm font-semibold">POSTS</span>
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-3 px-4 flex items-center gap-2 border-t-2 transition ${
                  activeTab === "saved"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <FaBookmark className="text-sm" />
                <span className="text-sm font-semibold">SAVED</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-3 px-4 flex items-center gap-2 border-t-2 transition ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <FaCog className="text-sm" />
                <span className="text-sm font-semibold">SETTINGS</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="mt-8">
            {/* Posts Grid */}
            {activeTab === "posts" && (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="relative group cursor-pointer">
                    <img
                      src={post.imageUrl}
                      alt={`Post ${post.id}`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-1 text-white">
                        <FaHeart className="text-xl" />
                        <span className="font-semibold">{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <FaComment className="text-xl" />
                        <span className="font-semibold">{formatNumber(post.comments)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Posts */}
            {activeTab === "saved" && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBookmark className="text-4xl text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Saved</h3>
                <p className="text-gray-400">
                  Save photos and videos that you want to see again
                </p>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Account Settings */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Account Settings</h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    <div className="p-4 flex items-center justify-between hover:bg-gray-750 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-gray-400" />
                        <div>
                          <div className="text-white text-sm font-medium">Private Account</div>
                          <div className="text-gray-500 text-xs">Only followers can see your posts</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-gray-750 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FaBell className="text-gray-400" />
                        <div>
                          <div className="text-white text-sm font-medium">Notifications</div>
                          <div className="text-gray-500 text-xs">Manage your notification preferences</div>
                        </div>
                      </div>
                      <FaArrowLeft className="text-gray-400 text-sm rotate-180" />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-gray-750 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FaMoon className="text-gray-400" />
                        <div>
                          <div className="text-white text-sm font-medium">Dark Mode</div>
                          <div className="text-gray-500 text-xs">Currently using dark theme</div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">On</span>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Privacy & Security</h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    <div className="p-4 flex items-center justify-between hover:bg-gray-750 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FaLock className="text-gray-400" />
                        <div>
                          <div className="text-white text-sm font-medium">Change Password</div>
                          <div className="text-gray-500 text-xs">Update your password</div>
                        </div>
                      </div>
                      <FaArrowLeft className="text-gray-400 text-sm rotate-180" />
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-gray-750 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-gray-400" />
                        <div>
                          <div className="text-white text-sm font-medium">Two-Factor Authentication</div>
                          <div className="text-gray-500 text-xs">Add an extra layer of security</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                        Setup
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-900/20 rounded-xl overflow-hidden border border-red-800/50">
                  <div className="p-4 border-b border-red-800/50">
                    <h3 className="text-red-400 font-semibold">Danger Zone</h3>
                  </div>
                  <div className="p-4">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <FaTrash />
                      Delete Account
                    </button>
                    <p className="text-gray-500 text-xs text-center mt-2">
                      Once deleted, your account cannot be recovered
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gray-800 text-red-400 rounded-xl hover:bg-gray-750 transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-3">Delete Account?</h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. All your data, posts, and messages will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Account deletion feature coming soon");
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;