import React from "react";
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaFileImage, FaFileAlt } from "react-icons/fa";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (hours < 48) return "Yesterday";
  return date.toLocaleDateString();
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const MessageBubble = ({ message, isOwn }) => {
  const renderFileContent = () => {
    const { content, type } = message;
    const fileData = typeof content === "string" ? { url: content, fileName: "file", mimeType: type } : content;
    const { url, fileName, mimeType, fileSize } = fileData;

    if (type === "image" || mimeType?.startsWith("image/")) {
      return (
        <div className="max-w-xs">
          <img src={url} alt={fileName} className="rounded-lg max-w-full cursor-pointer hover:opacity-90" onClick={() => window.open(url, "_blank")} />
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }
    if (type === "video" || mimeType?.startsWith("video/")) {
      return (
        <div className="max-w-xs">
          <video controls className="rounded-lg max-w-full">
            <source src={url} type={mimeType} />
          </video>
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }
    if (type === "audio" || mimeType?.startsWith("audio/")) {
      return (
        <div className="max-w-xs">
          <audio controls className="w-full">
            <source src={url} type={mimeType} />
          </audio>
          <p className="text-xs text-gray-300 mt-1">{fileName}</p>
        </div>
      );
    }

    const getFileIcon = () => {
      if (mimeType?.includes("pdf")) return <FaFilePdf className="text-red-400 text-2xl" />;
      if (mimeType?.includes("word")) return <FaFileWord className="text-blue-400 text-2xl" />;
      if (mimeType?.includes("excel")) return <FaFileExcel className="text-green-400 text-2xl" />;
      if (mimeType?.includes("zip")) return <FaFileArchive className="text-yellow-400 text-2xl" />;
      if (mimeType?.startsWith("image/")) return <FaFileImage className="text-purple-400 text-2xl" />;
      return <FaFileAlt className="text-gray-400 text-2xl" />;
    };

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition max-w-xs" download={fileName}>
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate">{fileName}</p>
          {fileSize && <p className="text-xs text-gray-300">{formatFileSize(fileSize)}</p>}
        </div>
        <FaFile className="text-gray-300" />
      </a>
    );
  };

  const renderContent = () => {
    switch (message.type) {
      case "gif":
        return <img src={message.content} alt="gif" className="w-40 rounded-lg" />;
      case "image":
      case "video":
      case "audio":
      case "file":
        return renderFileContent();
      default:
        return <p className="text-white break-words text-base">{message.text || message.message}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwn ? "bg-blue-600" : "bg-gray-700"} rounded-lg px-4 py-2`}>
        {renderContent()}
        <p className="text-xs text-gray-300 mt-1 text-right">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

export default MessageBubble;