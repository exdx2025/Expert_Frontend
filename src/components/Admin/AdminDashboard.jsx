import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminDarkMode } from "../context/DarkModeContext";
import adminImage from "./indianGroupDoctors.jpg";
import "./adminDashboard.css";
import AdminNavbar from "./AdminNavbar";
import { getAvailableRoutes } from "../utils/roleUtils";
import useSessionTimeout from "../../hooks/useSessionTimeout";
import SessionTimeoutModal from "./SessionTimeoutModal";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useAdminDarkMode();

  const { isActive, resetTimer } = useSessionTimeout(
    5 * 60 * 1000,
    8 * 60 * 60 * 1000
  );

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole) {
      window.location.href = "/admin-login";
      return;
    }
    setRole(userRole);
    setIsLoading(false);

    if (location.pathname === "/admin/dashboard") {
      navigate("/admin/dashboard/admin-dashboard");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!isActive && !showTimeoutModal && role) {
      setShowTimeoutModal(true);
      setCountdown(60);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleAutoLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isActive, showTimeoutModal, role]);

  const handleContinueSession = () => {
    const currentState = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      timestamp: Date.now(),
    };

    sessionStorage.setItem("preTimeoutState", JSON.stringify(currentState));
    sessionStorage.setItem("reauthenticationRequired", "true");
    sessionStorage.setItem("originalRole", role);

    setShowTimeoutModal(false);
    setCountdown(60);

    const returnUrl = encodeURIComponent(
      location.pathname + location.search + location.hash
    );
    window.location.href = `/admin-login?returnUrl=${returnUrl}`;
  };

  const handleAutoLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowTimeoutModal(false);

    sessionStorage.setItem(
      "logoutMessage",
      "Session expired due to inactivity. Please login again."
    );
    window.location.href = "/admin-login";
  };

  const handleManualLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/admin-login";
  };

  useEffect(() => {
    const checkReauthentication = () => {
      const reauthStatus = sessionStorage.getItem("reauthenticationSuccess");
      const preTimeoutState = sessionStorage.getItem("preTimeoutState");

      if (reauthStatus === "true" && preTimeoutState) {
        try {
          const state = JSON.parse(preTimeoutState);

          sessionStorage.removeItem("reauthenticationSuccess");
          sessionStorage.removeItem("preTimeoutState");
          sessionStorage.removeItem("reauthenticationRequired");
          sessionStorage.removeItem("originalRole");

          resetTimer();

          navigate(state.pathname + (state.search || "") + (state.hash || ""));

          toast.success("Session restored successfully!", {
            position: "top-right",
          });
        } catch (error) {
          console.error("Error restoring session:", error);
          navigate("/admin/dashboard/admin-dashboard");
        }
      }
    };

    checkReauthentication();
  }, [resetTimer, navigate]);

  useEffect(() => {
    const adminDashboard = document.querySelector(".admin-dashboard");
    if (adminDashboard) {
      if (darkMode) {
        adminDashboard.classList.add("dark");
      } else {
        adminDashboard.classList.remove("dark");
      }
    }
  }, [darkMode]);

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  const availableRoutes = role ? getAvailableRoutes(role) : [];

  const canAccess = React.useCallback(
    (route) => {
      return availableRoutes.includes(route);
    },
    [availableRoutes]
  );

  const getArrow = (section) => (activeDropdown === section ? "▲" : "▼");

  if (isLoading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const displayRole = role || "admin";
  const roleDisplayName =
    displayRole.charAt(0).toUpperCase() + displayRole.slice(1);

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : ""}`}>
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        onContinue={handleContinueSession}
        onLogout={handleAutoLogout}
        countdown={countdown}
      />

      <AdminNavbar />

      <div className="admin-sidebar">
        <div className="sidebar-header">
          <img src={adminImage} alt="Admin" className="admin-image" />
          <h2 className="sidebar-title">
            {displayRole === "super-admin"
              ? "Super Admin Panel"
              : `${roleDisplayName} Panel`}
          </h2>
          <div className="session-info">
            <small>Session active: {isActive ? "Yes" : "No"}</small>
          </div>
        </div>

        <nav className="sidebar-links">
          <div className="section-title">MAIN</div>
          {canAccess("admin-dashboard") && (
            <div
              className={`sidebar-link ${
                location.pathname.includes("admin-dashboard") ? "active" : ""
              }`}
              onClick={() => navigate("/admin/dashboard/admin-dashboard")}
            >
              <span className="icon">
                <i className="fas fa-tachometer-alt"></i>
              </span>
              Dashboard
            </div>
          )}

          <div className="section-title">LISTS</div>
          {canAccess("admin-offline-registration") && (
            <div
              className={`sidebar-link ${
                activeDropdown === "registration" ? "active" : ""
              }`}
              onClick={() => navigate("admin-offline-registration")}
            >
              <span className="icon">
                <i className="fas fa-user-plus"></i>
              </span>
              OffLine Registration
            </div>
          )}

          {canAccess("view-offline-registrations") && (
            <div
              className={`sidebar-link ${
                activeDropdown === "admin-offline-registration" ? "active" : ""
              }`}
              onClick={() =>
                navigate(
                  "admin-offline-registration/view-offline-registrations"
                )
              }
            >
              <span className="icon">
                <i className="fas fa-list-alt"></i>
              </span>
              View Registration
            </div>
          )}

          {canAccess("admincart") && (
            <div
              className={`sidebar-link ${
                activeDropdown === "admincart" ? "active" : ""
              }`}
              onClick={() => navigate("admincart")}
            >
              <span className="icon">
                <i className="fas fa-shopping-cart"></i>
              </span>
              Admin Cart
            </div>
          )}

          {canAccess("upload-prescription") && (
            <div
              className={`sidebar-link ${
                activeDropdown === "upload-prescription" ? "active" : ""
              }`}
              onClick={() => navigate("upload-prescription")}
            >
              <span className="icon">
                <i className="fas fa-file-prescription"></i>
              </span>
              Upload-Prescription
            </div>
          )}

          {canAccess("resume-submissions") && (
            <div
              className={`sidebar-link ${
                activeDropdown === "resume-submissions" ? "active" : ""
              }`}
              onClick={() => navigate("resume-submissions")}
            >
              <span className="icon">
                <i className="fas fa-file-alt"></i>
              </span>
              Resume Submissions
            </div>
          )}

          {(canAccess("category") ||
            canAccess("sub-category") ||
            canAccess("expert-service-list")) && (
            <>
              <div className="section-title">SERVICES</div>
              <div
                className="sidebar-link"
                onClick={() => toggleDropdown("service-list")}
              >
                <span className="icon">
                  <i className="fas fa-concierge-bell"></i>
                </span>
                Service List
                <span className="arrow">{getArrow("service-list")}</span>
              </div>
              <div
                className={`dropdown-container ${
                  activeDropdown === "service-list" ? "show" : ""
                }`}
              >
                {canAccess("category") && (
                  <Link to="category" className="dropdown-item">
                    Category
                  </Link>
                )}
                {canAccess("sub-category") && (
                  <Link to="sub-category" className="dropdown-item">
                    Sub-Category
                  </Link>
                )}
                {canAccess("expert-service-list") && (
                  <Link to="expert-service-list" className="dropdown-item">
                    Expert Packages
                  </Link>
                )}
              </div>
            </>
          )}

          {(canAccess("home-collection") ||
            canAccess("book-appointment") ||
            canAccess("ambulance-services")) && (
            <>
              <div
                className="sidebar-link"
                onClick={() => toggleDropdown("OnLine-registration")}
              >
                <span className="icon">
                  <i className="fas fa-globe"></i>
                </span>
                Online Registration
                <span className="arrow">{getArrow("OnLine-registration")}</span>
              </div>
              <div
                className={`dropdown-container ${
                  activeDropdown === "OnLine-registration" ? "show" : ""
                }`}
              >
                {canAccess("home-collection") && (
                  <Link to="home-collection" className="dropdown-item">
                    Home Collection
                  </Link>
                )}
                {canAccess("book-appointment") && (
                  <Link to="book-appointment" className="dropdown-item">
                    Book Appointment
                  </Link>
                )}
                {canAccess("ambulance-services") && (
                  <Link to="ambulance-services" className="dropdown-item">
                    Ambulance Service
                  </Link>
                )}
              </div>
            </>
          )}

          {(canAccess("request-callback") || canAccess("test-booking")) && (
            <>
              <div
                className="sidebar-link"
                onClick={() => toggleDropdown("book-for-test")}
              >
                <span className="icon">
                  <i className="fas fa-phone-volume"></i>
                </span>
                Call Back Request
                <span className="arrow">{getArrow("book-for-test")}</span>
              </div>
              <div
                className={`dropdown-container ${
                  activeDropdown === "book-for-test" ? "show" : ""
                }`}
              >
                {canAccess("request-callback") && (
                  <Link to="request-callback" className="dropdown-item">
                    Request Callback
                  </Link>
                )}
                {canAccess("test-booking") && (
                  <Link to="test-booking" className="dropdown-item">
                    Book Test Service
                  </Link>
                )}
              </div>
            </>
          )}

          {(canAccess("admin-advertisement") ||
            canAccess("view-contact-us") ||
            canAccess("admin-career")) && (
            <>
              <div className="section-title">MARKETING</div>
              {canAccess("admin-advertisement") && (
                <div
                  className={`sidebar-link ${
                    activeDropdown === "advertisements" ? "active" : ""
                  }`}
                  onClick={() => navigate("admin-advertisement")}
                >
                  <span className="icon">
                    <i className="fas fa-ad"></i>
                  </span>
                  Advertisements
                </div>
              )}
              {canAccess("view-contact-us") && (
                <div
                  className={`sidebar-link ${
                    activeDropdown === "view-contact-us" ? "active" : ""
                  }`}
                  onClick={() => navigate("view-contact-us")}
                >
                  <span className="icon">
                    <i className="fas fa-address-book"></i>
                  </span>
                  Contact Us
                </div>
              )}
              {canAccess("admin-career") && (
                <div
                  className={`sidebar-link ${
                    activeDropdown === "admin-career" ? "active" : ""
                  }`}
                  onClick={() => navigate("admin-career")}
                >
                  <span className="icon">
                    <i className="fas fa-briefcase"></i>
                  </span>
                  Career
                </div>
              )}
            </>
          )}

          {role === "super-admin" && (
            <>
              <div className="section-title">ADMIN</div>
              <div
                className="sidebar-link"
                onClick={() => toggleDropdown("adminManagement")}
              >
                <span className="icon">
                  <i className="fas fa-users-cog"></i>
                </span>
                Admin Management
                <span className="arrow">{getArrow("adminManagement")}</span>
              </div>
              <div
                className={`dropdown-container ${
                  activeDropdown === "adminManagement" ? "show" : ""
                }`}
              >
                <Link to="createAdmin" className="dropdown-item">
                  Create Admin Login
                </Link>
                <Link to="allAdmins" className="dropdown-item">
                  View All Admins
                </Link>
              </div>
            </>
          )}

          <div className="section-title">USER</div>
          <div
            className="sidebar-link sidebar-link-signout"
            onClick={handleManualLogout}
          >
            <span className="icon">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            Sign Out
          </div>
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
