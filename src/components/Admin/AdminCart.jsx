// AdminCart.js
import React, { useEffect, useState } from "react";
import "./AdminCart.css";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/Url";

const AdminCart = () => {
  const [carts, setCarts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminCarts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin-carts`);
        if (!res.ok) throw new Error("Failed to fetch cart data");
        const data = await res.json();
        setCarts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error("Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCarts();          
  }, []);

  const handleStatusChange = async (cartId, newStatus) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin-carts/${cartId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      setCarts((prev) =>
        prev.map((c) => (c._id === cartId ? { ...c, status: newStatus } : c))
      );
      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    }
  };

  const term = searchTerm.toLowerCase();
  const filteredCarts = carts.filter((cart) => {
    if (!cart) return false;
    const userMatch =
      cart.userName?.toLowerCase().includes(term) ||
      cart.userMobile?.includes(term) ||
      cart.userEmail?.toLowerCase().includes(term);
    const testMatch = cart.tests?.some(test => 
      test.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return userMatch || testMatch;
  });

  if (loading) return <div className="admin-cart-container">Loading cart data…</div>;
  if (error) return <div className="admin-cart-container error">{error}</div>;

  return (
    <div className="admin-cart-container">
      <h2>User Test Requests</h2>

      <div className="admincart-search-bar">
        <FaSearch className="admincart-search-icon" />
        <input
          type="text"
          placeholder="Search by user name, email, mobile or test…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCarts.length === 0 ? (
        <div className="no-items">
          {searchTerm ? "No matching requests found" : "No test requests yet"}
        </div>
      ) : (
        <div className="cart-items-table">
          {filteredCarts.map((cart) => (
            <div key={cart._id} className="user-cart-card">
              <div className="user-info">
                <h3>{cart.userName || "Unknown User"}</h3>
                <p><strong>Email:</strong> {cart.userEmail || "N/A"}</p>
                <p><strong>Mobile:</strong> {cart.userMobile || "N/A"}</p>
                
                {/* ✅ Only show total amount */}
                <div className="pricing-info">
                  <p><strong>Total Amount:</strong> ₹{cart.totalAmount?.toLocaleString() || 0}</p>
                </div>
                
                <p><strong>Date:</strong> {new Date(cart.createdAt).toLocaleString()}</p>

                <div className="status-control">
                  <label><strong>Status:</strong></label>
                  <select
                    value={cart.status || "pending"}
                    onChange={(e) => handleStatusChange(cart._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="tests-list">
                <h4>Selected Tests:</h4>
                <ul>
                  {cart.tests?.map((t, i) => (
                    <li key={i}>
                      <strong>{t.testName || "Unknown Test"}</strong>
                      <div className="test-pricing">
                        <span>Price: ₹{t.price?.toLocaleString()}</span>
                        {t.contrastPrice > 0 && (
                          <span className="contrast-price">
                            + Contrast: ₹{t.contrastPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {t.isExpertPackage && (
                        <span className="expert-badge">Expert Package</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCart;
