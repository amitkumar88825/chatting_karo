import React, { useState } from "react";
import { 
  FaSmile, 
  FaPaperclip, 
  FaMicrophone, 
  FaImage, 
  FaFile, 
  FaLocationArrow,
  FaTimes,
  FaPaperPlane  
} from "react-icons/fa";

const Footer = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage("");
    }
  };

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : type === 'file' ? '*/*' : '';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // console.log(`Uploading ${type}:`, file);
        // Handle file upload here
      }
    };
    input.click();
    setShowAttachments(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Attachments Menu */}
      {showAttachments && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowAttachments(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20 animate-slideUp">
            <div className="p-2">
              <button 
                onClick={() => handleFileUpload('image')}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition"
              >
                <FaImage className="text-green-500" />
                <span>Photo & Video</span>
              </button>
              <button 
                onClick={() => handleFileUpload('file')}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition"
              >
                <FaFile className="text-blue-500" />
                <span>Document</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition">
                <FaLocationArrow className="text-red-500" />
                <span>Location</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          className="text-gray-400 hover:text-white transition-all hover:scale-110"
        >
          <FaSmile className="text-2xl" />
        </button>

        {/* Attachments Button */}
        <button
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          className="text-gray-400 hover:text-white transition-all hover:scale-110"
        >
          <FaPaperclip className="text-2xl" />
        </button>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping?.(e.target.value);
          }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Voice Recording Button (Mobile) */}
        <button
          type="button"
          onClick={startRecording}
          className={`md:hidden text-gray-400 hover:text-white transition-all hover:scale-110 ${
            isRecording ? 'text-red-500 animate-pulse' : ''
          }`}
        >
          <FaMicrophone className="text-2xl" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <FaPaperPlane className="text-xl" />
        </button>
      </form>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute bottom-full left-0 mb-2 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          Recording...
          <button onClick={() => setIsRecording(false)} className="ml-2">
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default Footer;