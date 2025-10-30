// hooks/useSessionTimeout.js - Enhanced version
import { useState, useEffect, useCallback } from 'react';

const useSessionTimeout = (inactiveTimeout = 5 * 60 * 1000, // 5 minutes
                          totalSessionTime = 8 * 60 * 60 * 1000) => { // 8 hours
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(() => {
    // Get last activity from localStorage or current time
    return parseInt(localStorage.getItem('lastActivity')) || Date.now();
  });
  const [loginTime] = useState(() => {
    // Get login time from localStorage or current time
    return parseInt(localStorage.getItem('loginTime')) || Date.now();
  });

  // Save activity to localStorage
  const saveActivity = useCallback((time) => {
    localStorage.setItem('lastActivity', time.toString());
    setLastActivity(time);
  }, []);

  // Reset timer on user activity
  const resetTimer = useCallback(() => {
    const currentTime = Date.now();
    saveActivity(currentTime);
    setIsActive(true);
  }, [saveActivity]);

  // Track user activity
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize login time if not set
    if (!localStorage.getItem('loginTime')) {
      localStorage.setItem('loginTime', loginTime.toString());
    }

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, loginTime]);

  // Check for inactivity and total session time
  useEffect(() => {
    const checkActivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      const totalTime = currentTime - loginTime;

      console.log(`Session Check: Inactive for ${Math.round(inactiveTime/1000)}s, Total: ${Math.round(totalTime/1000)}s`);

      // Check for inactivity timeout
      if (inactiveTime > inactiveTimeout) {
        console.log('Session inactive timeout reached');
        setIsActive(false);
        return;
      }

      // Check for total session timeout
      if (totalTime > totalSessionTime) {
        console.log('Total session timeout reached');
        setIsActive(false);
        return;
      }

      setIsActive(true);
    };

    // Check every 30 seconds
    const interval = setInterval(checkActivity, 30000);
    
    // Check immediately on mount
    checkActivity();

    return () => clearInterval(interval);
  }, [lastActivity, loginTime, inactiveTimeout, totalSessionTime]);

  return { isActive, resetTimer, lastActivity, loginTime };
};

export default useSessionTimeout;