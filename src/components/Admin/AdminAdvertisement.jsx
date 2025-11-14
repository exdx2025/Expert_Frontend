import React, { useState, useEffect } from "react";
import "./AdminAdvertisement.css";
import { BACKEND_URL } from "../utils/Url";

const AdminAdvertisement = () => {
  const [tests, setTests] = useState([]);
  const [testsWithOffers, setTestsWithOffers] = useState([]);
  
  // Test Offer Form Data
  const [testOfferFormData, setTestOfferFormData] = useState({
    testId: "",
    offerDiscountPercent: "",
    offerValidUntil: "",
    offerDescription: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("AdminAdvertisement component mounted");
    fetchAllTests();
    fetchTestsWithOffers();
  }, []);

  // Fetch all tests for applying offers
  const fetchAllTests = async () => {
    try {
      setLoading(true);
      console.log("Fetching tests from API...");
      const response = await fetch(`${BACKEND_URL}/api/subcategories`);
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched tests from API:", data.data);
        // Log all test titles to see what we have
        if (data.data && data.data.length > 0) {
          console.log("All test titles:", data.data.map(test => test.title));
        }
        setTests(data.data);
      } else {
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tests that currently have active offers
  const fetchTestsWithOffers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subcategories/offers/active`);
      const data = await response.json();
      if (response.ok) {
        setTestsWithOffers(data.data);
      }
    } catch (error) {
      console.error("Error fetching tests with offers:", error);
    }
  };

  // Test Offer Handlers
  const handleTestOfferChange = (e) => {
    const { name, value } = e.target;
    setTestOfferFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestSelect = (testId) => {
    const selectedTest = tests.find(test => test._id === testId);
    if (selectedTest) {
      setTestOfferFormData(prev => ({
        ...prev,
        testId: testId,
        offerDescription: `Special offer on ${selectedTest.title} - Get ${prev.offerDiscountPercent || ''}% OFF!`
      }));
    }
  };

  const applyTestOffer = async (e) => {
    e.preventDefault();
    
    if (!testOfferFormData.testId || !testOfferFormData.offerDiscountPercent) {
      alert("Please select a test and enter discount percentage");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/subcategories/${testOfferFormData.testId}/apply-offer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offerDiscountPercent: parseInt(testOfferFormData.offerDiscountPercent),
            offerValidUntil: testOfferFormData.offerValidUntil,
            offerDescription: testOfferFormData.offerDescription
          })
        }
      );

      if (response.ok) {
        alert("Offer applied to test successfully!");
        resetTestOfferForm();
        fetchTestsWithOffers();
        fetchAllTests();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to apply offer");
      }
    } catch (error) {
      console.error("Error applying test offer:", error);
      alert("Failed to apply offer");
    }
  };

  const removeTestOffer = async (testId) => {
    if (window.confirm("Are you sure you want to remove this offer from the test?")) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/subcategories/${testId}/remove-offer`,
          {
            method: "POST"
          }
        );

        if (response.ok) {
          alert("Offer removed successfully!");
          fetchTestsWithOffers();
          fetchAllTests();
        }
      } catch (error) {
        console.error("Error removing test offer:", error);
        alert("Failed to remove offer");
      }
    }
  };

  const resetTestOfferForm = () => {
    setTestOfferFormData({
      testId: "",
      offerDiscountPercent: "",
      offerValidUntil: "",
      offerDescription: ""
    });
  };

  // Enhanced search function with better debugging
  const filteredTests = tests.filter(test => {
    if (!test || !test.title) {
      console.log("Test missing title:", test);
      return false;
    }
    
    const searchLower = searchQuery.toLowerCase().trim();
    const titleLower = test.title.toLowerCase();
    
    // Check if title contains search query
    const matchesSearch = titleLower.includes(searchLower);
    
    // Only log when actually searching (not empty search)
    if (searchQuery && (matchesSearch || searchLower.length > 2)) {
      console.log(`Search: "${searchLower}", Test: "${titleLower}", Match: ${matchesSearch}`);
    }
    
    return matchesSearch;
  });

  // Log when search results change
  useEffect(() => {
    if (searchQuery) {
      console.log(`Search results for "${searchQuery}":`, filteredTests.length, "tests found");
      console.log("Found tests:", filteredTests.map(t => t.title));
    }
  }, [filteredTests, searchQuery]);

  // Log when tests load
  useEffect(() => {
    if (tests.length > 0) {
      console.log("Total tests loaded:", tests.length);
      console.log("Sample tests:", tests.slice(0, 5).map(t => t.title));
    }
  }, [tests]);

  return (
    <div className="admin-advertisement-container">
      <h1>Test Offer Management</h1>
      
      <div className="admin-advertisement-test-offer-management">
        <div className="admin-advertisement-test-offer-form">
          <h2>Apply Offer to Test</h2>
          
          <div className="admin-advertisement-form-group">
            <label>Search Test:</label>
            <input
              type="text"
              placeholder="Search tests by name (e.g., MRI, X-Ray, CT Scan)..."
              value={searchQuery}
              onChange={(e) => {
                console.log("Search input changed to:", e.target.value);
                setSearchQuery(e.target.value);
              }}
            />
            <small style={{color: '#666', fontSize: '12px'}}>
              Currently showing {filteredTests.length} of {tests.length} tests
            </small>
          </div>

          <div className="admin-advertisement-form-group">
            <label>Select Test:</label>
            <select
              name="testId"
              value={testOfferFormData.testId}
              onChange={(e) => handleTestSelect(e.target.value)}
              required
            >
              <option value="">Select a test</option>
              {filteredTests.length === 0 && searchQuery ? (
                <option value="" disabled>
                  No tests found for "{searchQuery}"
                </option>
              ) : null}
              {filteredTests.map(test => (
                <option key={test._id} value={test._id}>
                  {test.title} - ₹{test.oldPrice}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-advertisement-form-group">
            <label>Discount Percentage:</label>
            <input
              type="number"
              name="offerDiscountPercent"
              value={testOfferFormData.offerDiscountPercent}
              onChange={handleTestOfferChange}
              min="1"
              max="90"
              placeholder="e.g., 40 for 40% OFF"
              required
            />
          </div>

          <div className="admin-advertisement-form-group">
            <label>Offer Valid Until:</label>
            <input
              type="datetime-local"
              name="offerValidUntil"
              value={testOfferFormData.offerValidUntil}
              onChange={handleTestOfferChange}
              required
            />
          </div>

          <div className="admin-advertisement-form-group">
            <label>Offer Description:</label>
            <textarea
              name="offerDescription"
              value={testOfferFormData.offerDescription}
              onChange={handleTestOfferChange}
              placeholder="Describe this special offer..."
              required
            />
          </div>

          <div className="admin-advertisement-form-actions">
            <button type="button" onClick={applyTestOffer} className="admin-advertisement-submit-btn">
              Apply Offer to Test
            </button>
            <button type="button" onClick={resetTestOfferForm} className="admin-advertisement-cancel-btn">
              Reset
            </button>
          </div>
        </div>

        <div className="admin-advertisement-active-test-offers">
          <h2>Tests with Active Offers</h2>
          {loading ? (
            <p>Loading...</p>
          ) : testsWithOffers.length === 0 ? (
            <p>No tests with active offers</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Original Price</th>
                  <th>Offer Price</th>
                  <th>Discount</th>
                  <th>Valid Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testsWithOffers.map(test => (
                  <tr key={test._id}>
                    <td>{test.title}</td>
                    <td>₹{test.oldPrice}</td>
                    <td className="discounted-price">₹{test.offerDiscountedPrice}</td>
                    <td className="discount-badge">{test.offerDiscountPercent}% OFF</td>
                    <td>{new Date(test.offerValidUntil).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => removeTestOffer(test._id)} 
                        className="admin-advertisement-delete-btn"
                      >
                        Remove Offer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAdvertisement;