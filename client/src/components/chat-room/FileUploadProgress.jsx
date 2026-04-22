import React from "react";

const FileUploadProgress = ({ progress }) => {
  if (progress === 0) return null;
  return (
    <div className="absolute bottom-full mb-2 left-0 right-0 z-50 px-4">
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
        <div className="flex justify-between text-sm text-white mb-1">
          <span>Uploading file...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default FileUploadProgress;