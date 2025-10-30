import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/roleUtils";

const AdminProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const reauthRequired = sessionStorage.getItem("reauthenticationRequired") === "true";

  useEffect(() => {
    if (reauthRequired) {
      // Force to re-authentication page if locked
      navigate("/admin-login?returnUrl=" + window.location.pathname);
      return;
    }

    if (!userRole || !hasPermission(requiredRole, userRole)) {
      navigate("/admin-login");
    }
  }, [userRole, requiredRole, reauthRequired, navigate]);

  if (!userRole || !hasPermission(requiredRole, userRole) || reauthRequired) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
