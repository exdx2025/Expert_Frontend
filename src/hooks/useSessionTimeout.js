import { useState, useEffect, useCallback } from "react";

const useSessionTimeout = (
  inactiveTimeout = 5 * 60 * 1000,
  totalSessionTime = 8 * 60 * 60 * 1000
) => {
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(() => {
    return parseInt(localStorage.getItem("lastActivity")) || Date.now();
  });
  const [loginTime] = useState(() => {
    return parseInt(localStorage.getItem("loginTime")) || Date.now();
  });

  const saveActivity = useCallback((time) => {
    localStorage.setItem("lastActivity", time.toString());
    setLastActivity(time);
  }, []);

  const resetTimer = useCallback(() => {
    const currentTime = Date.now();
    saveActivity(currentTime);
    setIsActive(true);
  }, [saveActivity]);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    if (!localStorage.getItem("loginTime")) {
      localStorage.setItem("loginTime", loginTime.toString());
    }

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, loginTime]);

  useEffect(() => {
    const checkActivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      const totalTime = currentTime - loginTime;

      if (inactiveTime > inactiveTimeout) {
        console.log("Session inactive timeout reached");
        setIsActive(false);
        return;
      }

      if (totalTime > totalSessionTime) {
        console.log("Total session timeout reached");
        setIsActive(false);
        return;
      }

      setIsActive(true);
    };

    const interval = setInterval(checkActivity, 30000);

    checkActivity();

    return () => clearInterval(interval);
  }, [lastActivity, loginTime, inactiveTimeout, totalSessionTime]);

  return { isActive, resetTimer, lastActivity, loginTime };
};

export default useSessionTimeout;
