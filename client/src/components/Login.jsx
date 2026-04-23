import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGoogle,
  FaGithub,
  FaArrowLeft,
  FaExclamationCircle,
  FaCheckCircle
} from "react-icons/fa";
import api from "../utils/api";
import ToastContainer from "./ui/ToastContainer";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [toasts, setToasts] = useState([]);
  const currentUser = useSelector((state) => state.user.user);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // const removeToast = (id) => {
  //   setToasts(prev => prev.filter(toast => toast.id !== id));
  // };  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {

      const res = await api.post("/auth/login", formData);
      
      if (res.status === 200) {
        
        addToast(`Welcome back, ${currentUser?.username || 'User'}!`, "success");
        
        // Redirect to dashboard or home page
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Login failed. Please check your connection and try again." });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
      
      <div className="relative w-full max-w-md">
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="absolute -top-8 left-0 text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">Sign in to continue</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500 group-focus-within:text-blue-500 text-sm transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500`}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                  <FaExclamationCircle className="text-xs" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-focus-within:text-blue-500 text-sm transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-gray-300 text-sm transition-colors" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-gray-300 text-sm transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500 text-xs flex items-center gap-1">
                  <FaExclamationCircle className="text-xs" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-offset-0 focus:ring-1 cursor-pointer"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>


            {/* Sign Up Link */}
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-xs">
            🔒 Secure login with end-to-end encryption
          </p>
          <p className="text-gray-500 text-xs">
            Need help? <a href="#" className="text-blue-500 hover:text-blue-400">Contact Support</a>
          </p>
        </div>
      </div>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  );
};

export default Login;