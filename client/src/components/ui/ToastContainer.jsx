import React, { useState } from "react";
import { createPortal } from "react-dom";
import Toast from "./Toast";

const ToastContainer = ({ toasts, removeToast }) => {
  const mountNode = document.getElementById('toast-root');

  // DEBUG: Check if mountNode is found
  if (!mountNode) {
    console.error("The element #toast-root was not found in the DOM!");
    return null;
  }

  return createPortal(
    <div className="toast-container-wrapper">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>,
    mountNode
  );
};


export default ToastContainer;