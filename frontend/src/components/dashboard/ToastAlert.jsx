// src/components/popup/ToastAlert.jsx
import { useEffect } from "react";
import "./ToastAlert.css";

function ToastAlert({ id, type = "sensor", title, message, onClose, duration = 0 }) {
  useEffect(() => {
    if (!duration) return; // duration = 0 이면 자동 닫힘 없음
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast-alert toast-${type}`}>
      <div className="toast-content">
        <strong className="toast-title">{title}</strong>
        <p className="toast-message">{message}</p>
      </div>

      <button className="toast-close" onClick={() => onClose(id)}>
        ✕
      </button>
    </div>
  );
}

export default ToastAlert;
