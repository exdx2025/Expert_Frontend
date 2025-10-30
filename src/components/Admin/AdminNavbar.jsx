// components/Admin/AdminNavbar.jsx
import React from 'react';
import { useAdminDarkMode } from "../context/DarkModeContext";

const AdminNavbar = () => {
  const { darkMode, dispatch } = useAdminDarkMode();

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE" });
  };

  return (
    <div className={`admin-navbar ${darkMode ? 'dark' : ''}`}>
      <div className="wrapper">
        <div className="search">
          <input 
            type="text" 
            placeholder="Search..." 
            aria-label="Search"
            className="search-input"
          />
          <i className="fas fa-search search-icon" aria-hidden="true"></i>
        </div>
        <div className="items">
          <div className="item" title="Language">
            <i className="fas fa-globe icon" aria-hidden="true"></i>
            <span>English</span>
          </div>
          
          <div 
            className="item" 
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{cursor: 'pointer'}}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleDarkMode()}
          >
            <i 
              className={`icon ${darkMode ? 'fas fa-sun' : 'fas fa-moon'}`}
              aria-hidden="true"
            ></i>
            <span className="sr-only">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
          
          <div className="item" title="Fullscreen">
            <i className="fas fa-expand-alt icon" aria-hidden="true"></i>
            <span className="sr-only">Fullscreen</span>
          </div>
          
          <div className="item" title="Notifications">
            <i className="fas fa-bell icon" aria-hidden="true"></i>
            <span className="sr-only">Notifications</span>
            {/* <div className="counter"></div> */}
          </div>
          
          <div className="item" title="Messages">
            <i className="fas fa-comment-dots icon" aria-hidden="true"></i>
            <span className="sr-only">Messages</span>
            {/* <div className="counter"></div> */}
          </div>
          
          <div className="item" title="Menu">
            <i className="fas fa-bars icon" aria-hidden="true"></i>
            <span className="sr-only">Menu</span>
          </div>
          
          <div className="item" title="User Profile">
            <img
              src="https://w7.pngwing.com/pngs/306/70/png-transparent-computer-icons-management-admin-silhouette-black-and-white-neck-thumbnail.png"
              alt="User Avatar"
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;