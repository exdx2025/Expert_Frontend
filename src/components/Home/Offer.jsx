import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Offer.css";
import { BACKEND_URL } from "../utils/Url";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Offer = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfferedTests();
  }, []);

  const fetchOfferedTests = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subcategories/offers/active`);
      console.log("Offered tests response status:", response.status);

      const data = await response.json();
      console.log("Received offered tests:", data);

      if (response.ok && data.data) {
        // Transform tests into carousel slides
        const offerSlides = data.data.map((test) => {
          const imageUrl = test.image 
            ? `${BACKEND_URL}/uploads/${test.image}`
            : "/default-test-image.jpg";
          
          return {
            _id: test._id,
            title: test.title,
            description: test.offerDescription || `Get ${test.offerDiscountPercent}% OFF on ${test.title}`,
            buttonText: "BOOK NOW",
            offerText: `${test.offerDiscountPercent}% \nOFF`,
            imageUrl: imageUrl,
            testData: test // Keep the full test data
          };
        });
        
        setSlides(offerSlides);
      } else {
        // Fallback to your existing offers if no test offers
        fetchStaticOffers();
      }
    } catch (error) {
      console.error("Error fetching offered tests:", error);
      // Fallback to static offers
      fetchStaticOffers();
    } finally {
      setLoading(false);
    }
  };

  const fetchStaticOffers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/offers`);
      const data = await response.json();

      if (response.ok) {
        const offersWithFullUrls = data.data.map((offer) => {
          const fullUrl = offer.imageUrl.startsWith("http")
            ? offer.imageUrl
            : `${BACKEND_URL}${offer.imageUrl}`;
          return {
            ...offer,
            imageUrl: fullUrl,
            isStaticOffer: true // Mark as static offer
          };
        });
        setSlides(offersWithFullUrls);
      }
    } catch (error) {
      console.error("Error fetching static offers:", error);
    }
  };

  const handleBookOffer = async (slide) => {
    if (slide.isStaticOffer) {
      // For static offers, navigate to all tests page
      navigate("/all-test");
      toast.info("Browse our tests with special offers!");
      return;
    }

    // For test offers, add to cart directly
    try {
      if (!token) {
        toast.error("Please login to book tests");
        navigate("/log-in");
        return;
      }

      const { success, error } = await addToCart(slide._id, slide.title);
      
      if (success) {
        toast.success(`${slide.title} added to cart with ${slide.testData?.offerDiscountPercent}% OFF!`);
      } else {
        toast.error(error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error booking offer:", error);
      toast.error("Failed to book offer");
    }
  };

  if (loading) {
    return <div className="offer-container">Loading offers...</div>;
  }

  if (slides.length === 0) {
    return <div className="offer-container">No offers available</div>;
  }

  return (
    <div className="offer-container">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={4000}
        swipeable
        emulateTouch
      >
        {slides.map((slide, index) => (
          <div className="offer-slide" key={index}>
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="offer-bg"
              onError={(e) => {
                console.error("Failed to load image:", slide.imageUrl);
                e.target.style.display = "none";
              }}
            />

            {/* Top Right Offer Text */}
            <div className="offer-per-badge">
              {slide.offerText.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>

            {/* Bottom Overlay Content */}
            <div className="offer-per-overlay">
              <div className="offer-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                {/* Show original and discounted price for test offers */}
                {!slide.isStaticOffer && slide.testData && (
                  <div className="offer-price-display">
                    <span className="original-price" style={{textDecoration: 'line-through', marginRight: '10px'}}>
                      ₹{slide.testData.oldPrice}
                    </span>
                    <span className="discounted-price" style={{color: '#e74c3c', fontWeight: 'bold'}}>
                      ₹{slide.testData.offerDiscountedPrice}
                    </span>
                  </div>
                )}
              </div>
              <button 
                className="offer-btn"
                onClick={() => handleBookOffer(slide)}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Offer;