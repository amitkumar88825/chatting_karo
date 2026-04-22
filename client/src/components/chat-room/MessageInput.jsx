import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "../ui/GifPicker";

const MessageInput = ({ onSendMessage, onSendGif, onAttachFile, isSending, uploadingFile, disabled }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const inputRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
          emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiObj) => {
    const emoji = emojiObj.emoji;
    const cursorPos = inputRef.current?.selectionStart || message.length;
    const newText = message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
    setMessage(newText);
    setTimeout(() => {
      inputRef.current?.focus();
      const newCursorPos = cursorPos + emoji.length;
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isSending || uploadingFile) return;
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-50" style={{ bottom: "100%", marginBottom: "10px" }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} theme="dark" width={350} height={400} />
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div className="absolute bottom-full mb-2 left-12 z-50">
          <GifPicker onSelect={(url) => { onSendGif(url); setShowGifPicker(false); }} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <button type="button" ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-white transform hover:scale-110" title="Emoji">
            <FaSmile className="text-xl" />
          </button>
          <button type="button" onClick={() => setShowGifPicker(!showGifPicker)} className="text-gray-400 hover:text-white transform hover:scale-110" title="GIF">
            GIF
          </button>
          <button type="button" onClick={onAttachFile} className="text-gray-400 hover:text-white transform hover:scale-110" title="Attach File" disabled={uploadingFile}>
            <FaPaperclip className="text-xl" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled || isSending || uploadingFile}
          />
          <button type="button" className="text-gray-400 hover:text-white md:hidden transform hover:scale-110" title="Voice Message">
            <FaMicrophone className="text-xl" />
          </button>
          <button type="submit" disabled={!message.trim() || isSending || uploadingFile} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;