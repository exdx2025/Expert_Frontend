// components/Admin/SessionTimeoutModal.jsx - Updated for re-authentication
import React, { useEffect } from "react";
import "./SessionTimeoutModal.css";

function SessionTimeoutModal({ isOpen, onContinue, onLogout, countdown }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <div className="session-timeout-header">
          <h3>Session Timeout Warning</h3>
        </div>

        <div className="session-timeout-body">
          <div className="warning-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>

          <p>Your session has expired due to inactivity.</p>
          <p>For security reasons, please re-authenticate to continue.</p>
          <p>
            Auto logout in <strong>{countdown} seconds</strong>.
          </p>

          <div className="session-timeout-progress">
            <div
              className="session-timeout-progress-bar"
              style={{ width: `${(countdown / 60) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="session-timeout-footer">
          <button onClick={onLogout} className="session-timeout-btn logout-btn">
            Logout Completely
          </button>
          <button
            onClick={onContinue}
            className="session-timeout-btn continue-btn"
            autoFocus
          >
            Re-login to Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutModal;
