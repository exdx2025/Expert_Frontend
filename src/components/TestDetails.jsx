import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TestDetails.css";
import { BACKEND_URL } from "../components/utils/Url";

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cart, addToCart } = useCart();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/subcategories/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTest(data.data);
        } else {
          setError("Failed to fetch test details");
        }
      } catch (err) {
        setError("Error fetching test details");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  const handleBookNow = async () => {
    if (!token) {
      toast.info("Please login to book this test", {});
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/log-in");
      return;
    }

    try {
      // Check if test is already in cart
      const isInCart = cart.some(
        (item) =>
          item.subCategoryId?._id === test._id || item.testId?._id === test._id
      );

      if (isInCart) {
        toast.info("This test is already in your cart", {});
      } else {
        // Add to cart
        await addToCart(test._id, test.title);
        toast.success("Test added to cart!", {});
      }
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!test) return <div className="not-found">Test not found</div>;

  return (
    <div className="test-details-main1">
      <div className="test-details-main2">
        <div className="test-details-box1">
          <h1>{test.title}</h1>
        </div>
        <div className="test-details-container">
          <div className="test-details-box1">
            {test.image && (
              <img
                src={`${BACKEND_URL}/uploads/${test.image}`}
                alt={test.title}
                className="test-image"
                onError={(e) => {
                  e.target.src = "/default-test-image.jpg";
                }}
              />
            )}
          </div>
          <div className="test-details-box2">
            <div className="detail-row description-row">
              <strong>Description:</strong>
              <span className="value-highlight description-text">
                {test.description}
              </span>
            </div>

            <div className="detail-row">
              <strong>Test Number:</strong>
              <span className="value-highlight">{test.testNo}</span>
            </div>

            <div className="detail-row">
              <strong>Serial Number:</strong>
              <span className="value-highlight">{test.expertSerialTestNo}</span>
            </div>

            <div className="detail-row-flex">
              <div>
                <strong>Category:</strong>
                <span className="value-highlight">{test.category}</span>
              </div>
              <div>
                <strong>Sub-Category:</strong>
                <span className="value-highlight">{test.subCategory}</span>
              </div>
            </div>

            <div className="price-book-row">
              <div className="price-info">
                <div className="price-flex">
                  <strong>Price:</strong>
                  <span className="price-highlight">₹{test.oldPrice}</span>
                </div>
                {test.contrastPrice && (
                  <div className="price-flex">
                    <strong>Contrast:</strong>
                    <span className="old-price">₹{test.contrastPrice}</span>
                  </div>
                )}
              </div>

              <div>
                <button className="book-button" onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TestDetails;
