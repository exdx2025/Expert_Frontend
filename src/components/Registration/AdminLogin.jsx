// components/Admin/AdminLogin.jsx - Fixed role detection
import React, { useState, useEffect } from "react";
import loginimg from "./logSigimg.jpg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./AdminLogin.css";


function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "admin", // Default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin/dashboard";

  // Check if this is a re-authentication request
  const isReauthentication = sessionStorage.getItem("reauthenticationRequired") === "true";
  const originalRole = sessionStorage.getItem("originalRole");

  // Role credentials
  const roleCredentials = {
    admin: {
      username: "admin",
      password: "ad123",
      displayName: "Admin",
    },
    account: {
      username: "account",
      password: "a123",
      displayName: "Account",
    },
    reception: {
      username: "reception",
      password: "r123",
      displayName: "Reception",
    },
  };

  // Set the role based on re-authentication context
  useEffect(() => {
    if (isReauthentication && originalRole) {
      console.log("Re-authentication detected for role:", originalRole);
      setCredentials((prev) => ({
        ...prev,
        role: originalRole,
        username: roleCredentials[originalRole]?.username || "", // Pre-fill username
      }));
    }
  }, [isReauthentication, originalRole]);

  // Handle input changes
  const adminHandleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle role switch
  const handleRoleSwitch = (newRole) => {
    if (!isReauthentication) {
      setCredentials({
        username: roleCredentials[newRole]?.username || "",
        password: "",
        role: newRole,
      });
    }
  };

  // Handle Admin Login with re-authentication support
  const handleAdminSubmit = (e) => {
    e.preventDefault();

    console.log("Login attempt for role:", credentials.role);
    console.log("Username:", credentials.username);
    console.log("Is re-authentication:", isReauthentication);

    const roleCreds = roleCredentials[credentials.role];

    if (!roleCreds) {
      toast.error("Invalid role configuration", { position: "top-right" });
      return;
    }

    // For re-authentication, we need to be more flexible with username validation
    if (isReauthentication) {
      // During re-auth, focus on password validation for the original role
      const correctCreds = roleCredentials[originalRole || credentials.role];

      if (credentials.password === correctCreds.password) {
        // Re-authentication successful
        toast.success(
          "Re-authentication Successful! Restoring your session...",
          {
            position: "top-right",
          }
        );

        // Mark re-authentication as successful
        sessionStorage.setItem("reauthenticationSuccess", "true");

        // Restore the original role
        const finalRole = originalRole || credentials.role;
        localStorage.setItem("role", finalRole);

        // Clear re-auth flags
        sessionStorage.removeItem("reauthenticationRequired");
        sessionStorage.removeItem("originalRole");

        setTimeout(() => {
          // Redirect back to the original page
          window.location.href = returnUrl || "/admin/dashboard";
        }, 1000);
      } else {
        toast.error(
          `Invalid password for ${correctCreds.displayName}. Try again!`,
          {
            position: "top-right",
          }
        );
      }
    } else {
      // Normal login - strict validation
      if (
        credentials.username === roleCreds.username &&
        credentials.password === roleCreds.password
      ) {
        toast.success(`${roleCreds.displayName} Login Successful!`, {
          position: "top-right",
        });

        localStorage.setItem("role", credentials.role);

        setTimeout(() => {
          navigate(returnUrl);
        }, 1000);
      } else {
        toast.error(
          `Invalid ${roleCreds.displayName} credentials. Try again!`,
          {
            position: "top-right",
          }
        );
      }
    }
  };

  // Handle cancel re-authentication
  const handleCancelReauth = () => {
    sessionStorage.clear();
    localStorage.clear();
    setCredentials({ username: "", password: "", role: "admin" });
    window.location.href = "/admin-login";
  };

  return (
    <div className="adminLogin-main">
      <div className="adminLogin-container">
        {/* Left Side - Image */}
        <div className="adminLogin-image-container">
          <img src={loginimg} alt="adminLogin Illustration" />
          {isReauthentication && (
            <div className="reauth-notification">
              <div className="reauth-badge">Session Restoration</div>
              <p>Please re-enter your password to continue your session</p>
              {originalRole && (
                <p className="current-role">
                  <strong>Role:</strong>{" "}
                  {roleCredentials[originalRole]?.displayName || originalRole}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Side - Form */}
        <div className="adminLogin-form-container">
          <h2 className="adminLogin-heading"> 
            {isReauthentication ? (
              <span className="reauth-title">
                <i className="fas fa-shield-alt"></i> Re-authentication Required
              </span>
            ) : (
              <>
                <span
                  className={
                    credentials.role === "admin"
                      ? "active-link"
                      : "inactive-link"
                  }
                  onClick={() => handleRoleSwitch("admin")}
                >
                  Admin
                </span>
                <span> | </span>
                <span
                  className={
                    credentials.role === "account"
                      ? "active-link"
                      : "inactive-link"
                  }
                  onClick={() => handleRoleSwitch("account")}
                >
                  Account
                </span>
                <span> | </span>
                <span
                  className={
                    credentials.role === "reception"
                      ? "active-link"
                      : "inactive-link"
                  }
                  onClick={() => handleRoleSwitch("reception")}
                >
                  Reception
                </span>
              </>
            )}
          </h2>

          {/* Login Form */}
          <div className="adminSec-container">
            {isReauthentication && originalRole && (
              <div className="reauth-info">
                <p>
                  <i className="fas fa-user-tag"></i> Logging in as:{" "}
                  <strong>
                    {roleCredentials[originalRole]?.displayName || originalRole}
                  </strong>
                </p>
                <p>
                  <i className="fas fa-info-circle"></i> Your session expired.
                  Enter password to continue.
                </p>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="adminLogin-details-form">
              {/* Show username field only for normal login */}
              {!isReauthentication && (
                <div className="adminLogin-form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    className="adminLogin-form-input"
                    placeholder={`Enter ${credentials.role} username`}
                    value={credentials.username}
                    onChange={adminHandleChange}
                    required
                  />
                </div>
              )}

              {/* Password field */}
              <div className="adminLogin-form-group">
                <label>Password:</label>
                <div className="adminLogin-password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="adminLogin-form-input"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={adminHandleChange}
                    required
                    autoFocus={isReauthentication} // Auto-focus on password during re-auth
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </div>

              <div className="adminLogin-login-buttons">
                <button type="submit" className="adminLogin-button primary">
                  {isReauthentication
                    ? "Continue Session"
                    : `Login as ${
                        roleCredentials[credentials.role]?.displayName ||
                        credentials.role
                      }`}
                </button>

                {isReauthentication && (
                  <button
                    type="button"
                    className="adminLogin-button secondary"
                    onClick={handleCancelReauth}
                  >
                    Cancel & Logout Completely
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
