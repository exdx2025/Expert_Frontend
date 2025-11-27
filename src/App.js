import "./App.css";
import { useLocation } from "react-router-dom";
import Routers from "./components/Routers";
import NavBarPage from "./components/pages/NavBarPage";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import { CartProvider } from "./components/context/CartContext";
import { AdminDarkModeContextProvider } from "./components/context/DarkModeContext";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "./components/context/axiosInterceptor";

function AppContent() {
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    const checkSession = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      const loginTime = localStorage.getItem("loginTime");

      if (lastActivity && loginTime) {
        const currentTime = Date.now();
        const inactiveTime = currentTime - parseInt(lastActivity);
        const totalTime = currentTime - parseInt(loginTime);
        if (inactiveTime > 5 * 60 * 1000 || totalTime > 4 * 60 * 60 * 1000) {
          localStorage.clear();
          sessionStorage.clear();
          if (location.pathname.startsWith("/admin/dashboard")) {
            window.location.href = "/admin-login";
          }
        }
      }
    };

    checkSession();
  }, [location]);

  const noHeaderFooterRoutes = [
    "/admin-login",
    "/admin/dashboard",
    "/superadmin/dashboard",
  ];

  const hideHeaderFooter = noHeaderFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const isAdminRoute = location.pathname.startsWith("/admin/dashboard");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {!hideHeaderFooter && <NavBarPage />}

      {isAdminRoute ? (
        <AdminDarkModeContextProvider>
          <Routers />
        </AdminDarkModeContextProvider>
      ) : (
        <Routers />
      )}

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <CartProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CartProvider>
    </div>
  );
}

export default App;
