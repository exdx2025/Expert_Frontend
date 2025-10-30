// src/components/context/AdminDarkModeContext.js
import { createContext, useReducer, useContext, useEffect } from "react";

// Initial state
const INITIAL_STATE = {
  darkMode: false,
};

// Create Context
export const AdminDarkModeContext = createContext(INITIAL_STATE);

// Reducer
const AdminDarkModeReducer = (state, action) => {
  switch (action.type) {
    case "LIGHT": {
      return {
        darkMode: false,
      };
    }
    case "DARK": {
      return {
        darkMode: true,
      };
    }
    case "TOGGLE": {
      return {
        darkMode: !state.darkMode,
      };
    }
    default:
      return state;
  }
};

// Context Provider (Admin-specific)
export const AdminDarkModeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AdminDarkModeReducer, INITIAL_STATE, () => {
    // Try to get dark mode preference from localStorage
    const darkMode = localStorage.getItem("adminDarkMode") === "true";
    return { darkMode };
  });

  useEffect(() => {
    localStorage.setItem("adminDarkMode", state.darkMode);
  }, [state.darkMode]);

  return (
    <AdminDarkModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {children}
    </AdminDarkModeContext.Provider>
  );
};

// Custom hook to use the admin dark mode context
export const useAdminDarkMode = () => {
  const context = useContext(AdminDarkModeContext);
  if (context === undefined) {
    throw new Error("useAdminDarkMode must be used within an AdminDarkModeContextProvider");
  }
  return context;
};