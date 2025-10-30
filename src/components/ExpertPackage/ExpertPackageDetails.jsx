import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ExpertPackageDetails.css";
import { RxDotFilled } from "react-icons/rx";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/Url";


const ExpertPackageDetails = () => {
  const { id } = useParams(); // Get package ID from URL
  const [packageData, setPackageData] = useState(null); // State to store package details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      toast.info("Please login to add items to cart");
      // navigate('/login');
    }
  }, [token]);

  // Fetch package details from backend
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/expertServiceLists/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch package details");
        }
        const data = await response.json();
        setPackageData(data.data); // Set package details
      } catch (error) {
        setError("Failed to fetch package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!packageData) {
    return <h2>Package not found!</h2>;
  }

  return (
    <div className="package-container">
      <div className="package-details">
        <h2 className="package-tittle">{packageData.testName}</h2>
        <h4 className="package-tagline">{packageData.tagLine}</h4>

        <p className="package-description">{packageData.description}</p>
        <hr />
        <br />

        <div className="test-parameters">
          <h3 className="package-parameters">Test Parameters</h3>
          <div className="test-list-container">
            {packageData.selectedTests.map((test, index) => (
              <div key={index} className="parameter-group">
                <h4 className="package-parameters-list">
                  <RxDotFilled className="icon" />
                  {test}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="package-pricing">
        <div className="pricing-box">
          <div className="price-box1">
            <h3 className="package-payment-title">Buying Price</h3>
            <h4 className="package-payment-percent">
              {packageData.discountPercent}%
            </h4>
          </div>
          <hr />
          <br />
          <div className="package-box2">
            <div className="expertPackage-title-box">
              <p className="expertPackage-title">{packageData.testName}</p>
              <p className="expertPackage-price">₹{packageData.oldPrice}</p>
            </div>
            <div className="expertPackage-offer-box">
              <p className="expertPackage-offer">Offer Price</p>
              <p className="expertPackage-discountPrice">
                ₹{packageData.discountPrice}
              </p>
            </div>
            <br />
            <br />
            <div className="expertPackage-totla-box">
              <p className="expertPackage-total">Total Price</p>
              <p className="expertPackage-card-price">
                ₹{packageData.discountPrice}/-
              </p>
            </div>
          </div>

          <button
            className={`add-to-cart ${isAddingToCart ? "loading" : ""}`}
            disabled={isAddingToCart}
            onClick={async () => {
              setIsAddingToCart(true);
              try {
                await addToCart(packageData._id, packageData.testName, true);
                toast.success(`${packageData.testName} added to cart`, {
                  position: "top-right",
                  autoClose: 1000,
                });
              } catch (error) {
                toast.error(error.message, {
                  position: "top-right",
                  autoClose: 3000,
                });
              } finally {
                setIsAddingToCart(false);
              }
            }}
          >
            {isAddingToCart ? <span className="spinner"></span> : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertPackageDetails;
