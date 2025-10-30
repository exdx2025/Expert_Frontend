import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart2.css";
import { FaTimes, FaHistory } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/Url";

const Cart2 = () => {
  const { cart, fetchCart, removeFromCart, clearCart } = useCart();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (token) fetchCart();
  }, [token, fetchCart]);

  // Cart2.js - Updated getTotalPrice function
  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const test = item.subCategoryId || item.testId;
      if (!test) return sum;

      let price = 0;

      if (item.isExpertPackage) {
        price = test.discountPrice || 0;
      } else {
        // Check for active offer
        if (test.hasOffer && test.offerValidUntil) {
          const offerValidUntil = new Date(test.offerValidUntil);
          if (offerValidUntil > new Date()) {
            // Use offer discounted price
            price = parseFloat(test.offerDiscountedPrice || test.oldPrice);
          } else {
            // Offer expired, use original price
            price = parseFloat(test.oldPrice || 0);
          }
        } else {
          // No offer, use original price
          price = parseFloat(test.oldPrice || 0);
        }

        // Add contrast price (if applicable)
        price += parseFloat(test.contrastPrice || 0);
      }

      return sum + price;
    }, 0);

  const closePayment = () => setShowPayment(false);

  const handleSaveCartToAdmin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!token) {
        toast.error("Please log in first.");
        setIsSubmitting(false);
        return;
      }

      const rawUser = localStorage.getItem("user");
      if (!rawUser) throw new Error("User details missing in localStorage");

      const { _id: userId, name, email, mobile } = JSON.parse(rawUser);

      const items = cart
        .filter((c) => c.subCategoryId || c.testId)
        .map((c) => ({
          testId: c.subCategoryId?._id || c.testId?._id,
          testName: c.subCategoryId?.title || c.testId?.testName || "",
          // quantity: c.quantity || 1,
          price: c.isExpertPackage
            ? c.testId?.discountPrice || 0
            : parseFloat(c.subCategoryId?.oldPrice || 0) +
              parseFloat(c.subCategoryId?.contrastPrice || 0),
          isExpertPackage: c.isExpertPackage || false,
        }));

      const adminCartRes = await fetch(`${BACKEND_URL}/api/admin-carts/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { userId, name, email, mobile },
          items,
        }),
      });

      const adminCartData = await adminCartRes.json();
      if (!adminCartRes.ok) {
        throw new Error(adminCartData.message || "Failed to save cart");
      }

      const historyRes = await fetch(
        `${BACKEND_URL}/person/save-test-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            tests: items,
          }),
        }
      );

      const historyData = await historyRes.json();
      if (!historyRes.ok) {
        throw new Error(historyData.message || "Failed to save test history");
      }

      await clearCart();

      toast.success(
        "Test request submitted successfully! Our team will contact you soon."
      );
      closePayment();
      fetchCart();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error(err.message || "Failed to submit your test request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Basket</h2>
        <Link to="/history" className="history-link">
          <FaHistory />
          <span>View Test History</span>
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty</p>
          <button
            className="continue-shopping-btn"
            onClick={() => (window.location.href = "/")}
          >
            Continue...
          </button>
        </div>
      ) : (
        <>
          <div className="cart-wrapper">
            <div className="cart-items">
              {cart.map((item) => {
                let test;
                let price = 0;
                let hasOffer = false;
                let originalPrice = 0;

                if (item.isExpertPackage) {
                  test = item.testId;
                  price = test?.discountPrice || 0;
                } else {
                  test = item.subCategoryId || item.testId;
                  originalPrice = parseFloat(test?.oldPrice || 0);

                  // Check for active offer
                  if (test?.hasOffer && test?.offerValidUntil) {
                    const offerValidUntil = new Date(test.offerValidUntil);
                    if (offerValidUntil > new Date()) {
                      price = parseFloat(
                        test.offerDiscountedPrice || test.oldPrice
                      );
                      hasOffer = true;
                    } else {
                      price = originalPrice;
                    }
                  } else {
                    price = originalPrice;
                  }

                  // Add contrast price
                  price += parseFloat(test?.contrastPrice || 0);
                }

                return (
                  <div className="cart-card" key={item._id || test._id}>
                    <img
                      src={
                        test?.image && typeof test.image === "string"
                          ? `${BACKEND_URL}/uploads/${test.image}`
                          : "/default-test-image.jpg"
                      }
                      alt={test.title || test.testName || "Test Image"}
                      className="cart-image"
                      onError={(e) => {
                        if (!e.target.src.includes("/default-test-image.jpg")) {
                          e.target.src = "/default-test-image.jpg";
                        }
                      }}
                    />

                    <div className="cart-info">
                      <h3>{test.title || test.testName || "Unnamed Test"}</h3>

                      {/* Show offer price if applicable */}
                      {!item.isExpertPackage && hasOffer ? (
                        <div className="offer-price-display">
                          <span
                            className="original-price"
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                            }}
                          >
                            ₹{originalPrice.toLocaleString()}
                          </span>
                          <span
                            className="discounted-price"
                            style={{
                              color: "#e74c3c",
                              fontWeight: "bold",
                              marginLeft: "8px",
                            }}
                          >
                            ₹{price.toLocaleString()}
                          </span>
                          <span
                            className="offer-badge"
                            style={{
                              background: "#e74c3c",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              marginLeft: "8px",
                            }}
                          >
                            {test.offerDiscountPercent}% OFF
                          </span>
                        </div>
                      ) : (
                        <p>Price: ₹{price.toLocaleString()}</p>
                      )}

                      {/* Show base + contrast breakdown for non-expert tests */}
                      {!item.isExpertPackage && (
                        <p>
                          Base: ₹{parseFloat(test?.oldPrice || 0)} + Contrast: ₹
                          {parseFloat(test?.contrastPrice || 0)}
                        </p>
                      )}

                      {/* Extra expert package info */}
                      {item.isExpertPackage && (
                        <div className="expert-details">
                          <p>Tests Included: {test?.howManyTest}</p>
                          <p>Report Time: {test?.reportTime} hrs</p>
                          <p>Tagline: {test?.tagLine}</p>
                        </div>
                      )}
                    </div>

                    <button
                      className="remove-item-btn"
                      onClick={() => removeFromCart(test?._id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h3>Summary</h3>
              <p>Subtotal: ₹{getTotalPrice().toLocaleString()}</p>
              <p>Delivery: Free</p>
              <hr />
              <p className="total-price">
                Total: ₹{getTotalPrice().toLocaleString()}
              </p>
              <button
                className="checkout-btn"
                onClick={() => setShowPayment(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          {showPayment && (
            <div className="payment-overlay">
              <div className="payment-modal">
                <button className="close-payment" onClick={closePayment}>
                  <FaTimes />
                </button>

                <h3>Payment Information</h3>
                <div className="payment-message">
                  <p className="main-message">Pay when you visit the centre.</p>
                  <p className="sub-message">
                    Online payments are coming soon—thanks for your patience!
                  </p>
                </div>

                <button
                  className="continue-btn"
                  onClick={handleSaveCartToAdmin}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default Cart2;
