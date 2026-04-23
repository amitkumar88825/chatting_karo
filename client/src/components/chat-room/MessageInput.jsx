import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone, FaStop, FaTrash, FaPlay, FaPause } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "../ui/GifPicker";

const MessageInput = ({ onSendMessage, onSendGif, onAttachFile, onSendAudio, isSending, uploadingFile, disabled }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const gifButtonRef = useRef(null);
  const gifPickerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

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

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  // --- Audio Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
    // Discard the recorded audio
    setAudioBlob(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
  };

  const sendAudioMessage = () => {
    if (audioBlob && onSendAudio) {
      onSendAudio(audioBlob);
      // Reset audio state
      setAudioBlob(null);
      setAudioURL(null);
      setRecordingTime(0);
    }
  };

  const togglePlayback = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Emoji & Message Handlers ---
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

  // --- Render ---
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

      {/* Audio Recording Preview UI */}
      {audioBlob && audioURL && (
        <div className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-3 z-50">
          <button onClick={togglePlayback} className="text-white bg-blue-600 rounded-full p-2 hover:bg-blue-700">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <audio ref={audioPlayerRef} src={audioURL} onEnded={() => setIsPlaying(false)} className="hidden" />
          <span className="text-white text-sm">Audio message ({formatTime(recordingTime)})</span>
          <button onClick={sendAudioMessage} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
            Send
          </button>
          <button onClick={cancelRecording} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            <FaTrash />
          </button>
        </div>
      )}

      {/* Recording Indicator (while recording) */}
      {isRecording && !audioBlob && (
        <div className="absolute bottom-full mb-2 left-0 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50 animate-pulse">
          <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
          Recording... {formatTime(recordingTime)}
          <button onClick={stopRecording} className="ml-2 bg-white text-red-600 px-2 py-1 rounded text-sm">
            <FaStop />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <button type="button" ref={emojiButtonRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-white transform hover:scale-110" title="Emoji">
            <FaSmile className="text-xl" />
          </button>

          <button type="button" ref={gifButtonRef} onClick={() => setShowGifPicker(!showGifPicker)} className="text-gray-400 hover:text-white transform hover:scale-110" title="GIF">
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

          {/* Voice message button – now fully functional */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`text-gray-400 hover:text-white transform hover:scale-110 transition ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
            title="Voice Message"
            disabled={!!audioBlob} // disable if already recorded but not sent
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