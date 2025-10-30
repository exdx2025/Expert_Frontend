// App.js - Complete version with session persistence
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

  // Setup axios interceptors when the component mounts
  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, [logout]);

  // ✅ ADD THIS: Check for expired session on route changes
  useEffect(() => {
    const checkSession = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const loginTime = localStorage.getItem('loginTime');
      
      if (lastActivity && loginTime) {
        const currentTime = Date.now();
        const inactiveTime = currentTime - parseInt(lastActivity);
        const totalTime = currentTime - parseInt(loginTime);
        
        // 5 minutes inactivity or 4 hours total session
        if (inactiveTime > 5 * 60 * 1000 || totalTime > 4 * 60 * 60 * 1000) {
          localStorage.clear();
          sessionStorage.clear();
          if (location.pathname.startsWith('/admin/dashboard')) {
            window.location.href = '/admin-login';
          }
        }
      }
    };

    checkSession();
  }, [location]);

  // Define the routes where NavBarPage and Footer should not be displayed
  const noHeaderFooterRoutes = [
    "/admin-login",
    "/admin/dashboard",
    "/superadmin/dashboard",
  ];

  // Check if the current route matches any of the specified routes
  const hideHeaderFooter = noHeaderFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Check if we're in admin section
  const isAdminRoute = location.pathname.startsWith("/admin/dashboard");

  return (
    <>
      {/* ToastContainer should be at the root level */}
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
      
      {/* Only wrap admin routes with dark mode provider */}
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