import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./HistoryTest.css";
import { FaCheck, FaTimes, FaClock, FaTag, FaCalendarAlt, FaList } from "react-icons/fa";
import { BACKEND_URL } from "../utils/Url";

const HistoryTest = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/person/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setHistory(data.testHistory || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Group tests by booking session (same date and time)
  const groupTestsByBooking = useCallback((tests) => {
    const grouped = {};

    tests.forEach((test) => {
      const dateKey = new Date(test.date).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          bookingDate: test.date,
          tests: [],
          totalAmount: 0,
          originalTotalAmount: 0,
          totalDiscount: 0,
          status: test.status
        };
      }

      grouped[dateKey].tests.push(test);

      // ✅ Removed quantity references (assume 1 per test)
      grouped[dateKey].totalAmount += test.price || 0;
      grouped[dateKey].originalTotalAmount += test.originalPrice || test.price || 0;
    });

    Object.keys(grouped).forEach(key => {
      grouped[key].totalDiscount = grouped[key].originalTotalAmount - grouped[key].totalAmount;
    });

    return Object.values(grouped).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  }, []);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token, fetchHistory]);

  useEffect(() => {
    if (history.length > 0) {
      const grouped = groupTestsByBooking(history);
      setGroupedHistory(grouped);
    }
  }, [history, groupTestsByBooking]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheck className="status-completed" />;
      case "cancelled":
        return <FaTimes className="status-cancelled" />;
      default:
        return <FaClock className="status-pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "processing":
        return "Processing";
      default:
        return "Pending";
    }
  };

  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="history-container">Loading...</div>;
  if (error) return <div className="history-container error">{error}</div>;

  return (
    <div className="history-container">
      <h2>Your Test History</h2>

      {groupedHistory.length === 0 ? (
        <div className="empty-history">
          <p>You haven't booked any tests yet.</p>
          <Link to="/" className="browse-tests-btn">
            Browse Tests
          </Link>
        </div>
      ) : (
        <div className="booking-list">
          {groupedHistory.map((booking, index) => (
            <div key={index} className="booking-card">
              {/* Booking Header */}
              <div className="booking-header">
                <div className="booking-info">
                  <FaCalendarAlt className="booking-icon" />
                  <div>
                    <h3>Booking #{groupedHistory.length - index}</h3>
                    <span className="booking-date">
                      {formatBookingDate(booking.bookingDate)}
                    </span>
                  </div>
                </div>

                <div className="booking-status">
                  {getStatusIcon(booking.status)}
                  <span className={`status-badge status-${booking.status}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>

              {/* Tests List */}
              <div className="tests-section">
                <div className="tests-header">
                  <FaList className="tests-icon" />
                  <span>Tests ({booking.tests.length})</span>
                </div>

                <div className="tests-grid">
                  {booking.tests.map((test, testIndex) => (
                    <div key={testIndex} className={`test-item ${test.hasOffer ? "has-offer" : ""}`}>
                      <div className="test-main-info">
                        <h4>{test.testName}</h4>
                        <div className="test-badges">
                          {test.isExpertPackage && (
                            <span className="expert-badge">Expert Package</span>
                          )}
                          {test.hasOffer && (
                            <span className="offer-badge">
                              <FaTag className="offer-icon" />
                              {test.offerDiscountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="test-pricing">
                        {/* Original Price (if offer exists) */}
                        {test.hasOffer && test.originalPrice && (
                          <div className="price-line">
                            <span className="original-price">
                              ₹{test.originalPrice?.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* Final Price */}
                        <div className="price-line">
                          <span className="final-price">
                            ₹{test.price?.toLocaleString()}
                          </span>
                          {test.contrastPrice > 0 && (
                            <span className="contrast-note">
                              (+₹{test.contrastPrice?.toLocaleString()} contrast)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="booking-summary">
                <div className="summary-row">
                  <span className="summary-label">Original Total:</span>
                  <span className="original-total">
                    ₹{booking.originalTotalAmount?.toLocaleString()}
                  </span>
                </div>

                {booking.totalDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span className="summary-label">Total Discount:</span>
                    <span className="discount-amount">
                      -₹{booking.totalDiscount?.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="summary-row total-row">
                  <span className="summary-label">Final Amount:</span>
                  <span className="final-total">
                    ₹{booking.totalAmount?.toLocaleString()}
                  </span>
                </div>

                {booking.totalDiscount > 0 && (
                  <div className="savings-banner">
                    <span>
                      You saved ₹{booking.totalDiscount?.toLocaleString()} on this booking!
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTest;
