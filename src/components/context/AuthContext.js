import { createContext, useState, useEffect, useContext } from 'react';
import { BACKEND_URL } from "../utils/Url";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("authToken") || null);
    const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });


   const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Consider invalid tokens as expired
    }
  };

  // ✅ Fetch user profile after login
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/person/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (response.status === 401) {
        // Token is invalid
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

   // ✅ Check token expiration on app load and periodically
  useEffect(() => {
    const checkTokenValidity = () => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    };

    // Check immediately on app load
    checkTokenValidity();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkTokenValidity, 60000);
    
    return () => clearInterval(intervalId);
  }, [token]);

  // ✅ Sync token with localStorage
  useEffect(() => {
    if (token) {
      // Check if token is valid before storing
      if (!isTokenExpired(token)) {
        localStorage.setItem("authToken", token);
        fetchUserData(token);
      } else {
        // Token is expired, clear it
        logout();
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

   // ✅ Login function to properly set token and user
  const login = (newToken, userData) => {
    if (!isTokenExpired(newToken)) {
      setToken(newToken);
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } else {
      console.error("Token is expired");
      logout();
    }
  };

  // ✅ Logout function
 const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);