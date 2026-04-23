import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone, FaTrash } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "../ui/GifPicker";

const MessageInput = ({ onSendMessage, onSendGif, onAttachFile, onSendAudio, isSending, uploadingFile, disabled }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cancelRecording, setCancelRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);       // not used directly for hold-to-send, but kept for potential preview
  const [showCancelZone, setShowCancelZone] = useState(false);

  // Refs for DOM elements and timers
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const gifButtonRef = useRef(null);
  const gifPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const startTimeRef = useRef(null);
  const streamRef = useRef(null);
  const isCancelledRef = useRef(false);

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
          emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target) &&
          gifButtonRef.current && !gifButtonRef.current.contains(event.target)) {
        setShowGifPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  // --- Recording logic ---
  const startRecording = async () => {
    if (!onSendAudio) return;
    isCancelledRef.current = false;
    setCancelRecording(false);
    setShowCancelZone(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (!isCancelledRef.current && audioChunksRef.current.length) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          await onSendAudio(blob);   // send directly
        }
        // Cleanup
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setRecordingTime(0);
        setShowCancelZone(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone");
    }
  };

  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    isCancelledRef.current = false;
    mediaRecorderRef.current.stop();
  };

  const cancelRecordingAndStop = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    isCancelledRef.current = true;
    setCancelRecording(true);
    setShowCancelZone(false);
    mediaRecorderRef.current.stop();
  };

  // Handling hold events (mouse / touch)
  const handlePointerDown = (e) => {
    e.preventDefault();
    startRecording();
    // Add global listeners for release / move
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
  };

  const handlePointerUp = () => {
    if (isRecording) {
      if (showCancelZone) {
        cancelRecordingAndStop();
      } else {
        stopRecordingAndSend();
      }
    }
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointermove", handlePointerMove);
  };

  const handlePointerMove = (e) => {
    if (!isRecording) return;
    // Get the microphone button's bounding rectangle
    const button = document.getElementById("voice-record-button");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const distance = Math.hypot(e.clientX - rect.left - rect.width/2, e.clientY - rect.top - rect.height/2);
    // If dragged more than 80px from center, show cancel zone and mark for cancel
    const isOut = distance > 80;
    setShowCancelZone(isOut);
  };

  // --- Emoji & text handlers ---
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

  const handleGifSelect = (url) => {
    onSendGif(url);
    setShowGifPicker(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} theme="dark" width={350} height={400} />
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div ref={gifPickerRef} className="absolute bottom-full mb-2 left-0 z-50">
          <GifPicker onSelect={handleGifSelect} />
        </div>
      )}

      {/* Recording indicator (overlay) */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900/90 rounded-2xl p-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-lg font-mono">{formatTime(recordingTime)}</span>
            </div>
            <div className="text-white text-sm">
              {showCancelZone ? "Release to cancel" : "Slide up to cancel"}
            </div>
            {showCancelZone && (
              <div className="mt-2 p-3 bg-red-600 rounded-full">
                <FaTrash className="text-white text-xl" />
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-400 hover:text-white transform hover:scale-110"
            title="Emoji"
          >
            <FaSmile className="text-xl" />
          </button>

          <button
            type="button"
            ref={gifButtonRef}
            onClick={() => setShowGifPicker(!showGifPicker)}
            className="text-gray-400 hover:text-white transform hover:scale-110"
            title="GIF"
          >
            GIF
          </button>

          <button
            type="button"
            onClick={onAttachFile}
            className="text-gray-400 hover:text-white transform hover:scale-110"
            title="Attach File"
            disabled={uploadingFile}
          >
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

          {/* Telegram‑style voice button: hold to record */}
          <button
            id="voice-record-button"
            type="button"
            onPointerDown={handlePointerDown}
            className={`text-gray-400 hover:text-white transform hover:scale-110 transition ${
              isRecording ? "text-red-500 animate-pulse" : ""
            }`}
            title="Hold to record voice message"
            disabled={!!audioBlob || uploadingFile} // optional: disable if already a pending audio
          >
            <FaMicrophone className="text-xl" />
          </button>

          <button
            type="submit"
            disabled={!message.trim() || isSending || uploadingFile}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;