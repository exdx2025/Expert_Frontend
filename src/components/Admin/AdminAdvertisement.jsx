import React, { useState, useEffect } from "react";
import "./AdminAdvertisement.css";
import { BACKEND_URL } from "../utils/Url";

const AdminAdvertisement = () => {
  const [activeTab, setActiveTab] = useState("staticOffers"); // "staticOffers" or "testOffers"
  const [staticOffers, setStaticOffers] = useState([]);
  const [tests, setTests] = useState([]);
  const [testsWithOffers, setTestsWithOffers] = useState([]);
  
  // Static Offer Form Data
  const [staticFormData, setStaticFormData] = useState({
    image: "",
    title: "",
    description: "",
    buttonText: "BOOK NOW",
    offerText: "40% \nOffer"
  });
  
  // Test Offer Form Data
  const [testOfferFormData, setTestOfferFormData] = useState({
    testId: "",
    offerDiscountPercent: "",
    offerValidUntil: "",
    offerDescription: ""
  });
  
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStaticOffers();
    fetchAllTests();
    fetchTestsWithOffers();
  }, []);

  // Fetch static banner offers
  const fetchStaticOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/offers`);
      const data = await response.json();
      if (response.ok) {
        setStaticOffers(data.data);
      }
    } catch (error) {
      console.error("Error fetching static offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tests for applying offers
  const fetchAllTests = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subcategories`);
      const data = await response.json();
      if (response.ok) {
        setTests(data.data);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
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

  // Static Offer Handlers
  const handleStaticChange = (e) => {
    const { name, value } = e.target;
    setStaticFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStaticFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaticSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", staticFormData.title);
    formDataToSend.append("description", staticFormData.description);
    formDataToSend.append("buttonText", staticFormData.buttonText);
    formDataToSend.append("offerText", staticFormData.offerText);
    if (staticFormData.image) {
      formDataToSend.append("image", staticFormData.image);
    }

    const url = editId 
      ? `${BACKEND_URL}/api/offers/${editId}`
      : `${BACKEND_URL}/api/offers`;
    
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        alert(`Static offer ${editId ? "updated" : "created"} successfully!`);
        fetchStaticOffers();
        resetStaticForm();
      }
    } catch (error) {
      console.error("Error submitting static offer:", error);
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

  // Static Offer Management
  const handleEdit = (offer) => {
    setStaticFormData({
      title: offer.title,
      description: offer.description,
      buttonText: offer.buttonText,
      offerText: offer.offerText,
      image: ""
    });
    setEditId(offer._id);
    setImagePreview(`${BACKEND_URL}${offer.imageUrl}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this static offer?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/offers/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("Static offer deleted successfully!");
          fetchStaticOffers();
        }
      } catch (error) {
        console.error("Error deleting static offer:", error);
      }
    }
  };

  const resetStaticForm = () => {
    setStaticFormData({
      image: "",
      title: "",
      description: "",
      buttonText: "BOOK NOW",
      offerText: "40% \nOffer"
    });
    setEditId(null);
    setImagePreview(null);
  };

  const resetTestOfferForm = () => {
    setTestOfferFormData({
      testId: "",
      offerDiscountPercent: "",
      offerValidUntil: "",
      offerDescription: ""
    });
  };

  // Filter tests based on search
  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-advertisement-container">
      <h1>Advertisement & Offer Management</h1>
      
      {/* Tab Navigation */}
      <div className="admin-advertisement-tab-navigation">
        <button 
          className={`admin-advertisement-tab-button ${activeTab === "staticOffers" ? "active" : ""}`}
          onClick={() => setActiveTab("staticOffers")}
        >
          Static Banner Offers
        </button>
        <button 
          className={`admin-advertisement-tab-button ${activeTab === "testOffers" ? "active" : ""}`}
          onClick={() => setActiveTab("testOffers")}
        >
          Test Offers
        </button>
      </div>

      {/* Static Banner Offers Tab */}
      {activeTab === "staticOffers" && (
        <>
          <form onSubmit={handleStaticSubmit} className="advertisement-form" encType="multipart/form-data">
            <h2>{editId ? "Edit Static Offer" : "Create Static Offer Banner"}</h2>
            
            <div className="admin-advertisement-form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={staticFormData.title}
                onChange={handleStaticChange}
                required
              />
            </div>

            <div className="admin-advertisement-form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={staticFormData.description}
                onChange={handleStaticChange}
                required
              />
            </div>

            <div className="admin-advertisement-form-group">
              <label>Button Text:</label>
              <input
                type="text"
                name="buttonText"
                value={staticFormData.buttonText}
                onChange={handleStaticChange}
              />
            </div>

            <div className="admin-advertisement-form-group">
              <label>Offer Text (use \n for line break):</label>
              <textarea
                name="offerText"
                value={staticFormData.offerText}
                onChange={handleStaticChange}
                required
              />
            </div>

            <div className="admin-advertisement-form-group">
              <label>Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required={!editId}
              />
              {imagePreview && (
                <div className="admin-advertisement-image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="admin-advertisement-form-actions">
              <button type="admin-advertisement-submit" className="admin-advertisement-submit-btn">
                {editId ? "Update" : "Create"} Static Offer
              </button>
              {editId && (
                <button type="button" onClick={resetStaticForm} className="admin-advertisement-cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="advertisement-list">
            <h2>Current Static Offers</h2>
            {loading ? (
              <p>Loading...</p>
            ) : staticOffers.length === 0 ? (
              <p>No static offers found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staticOffers.map((offer) => (
                    <tr key={offer._id}>
                      <td>
                        {offer.imageUrl && (
                          <img 
                            src={`${BACKEND_URL}${offer.imageUrl}`} 
                            alt={offer.title} 
                            className="admin-advertisement-offer-thumbnail" 
                            onError={(e) => {
                              console.error("Image failed to load:", e.target.src);
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </td>
                      <td>{offer.title}</td>
                      <td>{offer.description}</td>
                      <td>
                        <button onClick={() => handleEdit(offer)} className="admin-advertisement-edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(offer._id)} className="admin-advertisement-delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Test Offers Tab */}
      {activeTab === "testOffers" && (
        <>
          <div className="admin-advertisement-test-offer-management">
            <div className="admin-advertisement-test-offer-form">
              <h2>Apply Offer to Test</h2>
              
              <div className="admin-advertisement-form-group">
                <label>Search Test:</label>
                <input
                  type="text"
                  placeholder="Search tests by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                <button type="button" onClick={applyTestOffer} className="submit-btn">
                  Apply Offer to Test
                </button>
                <button type="admin-advertisement-button" onClick={resetTestOfferForm} className="admin-advertisement-cancel-btn">
                  Reset
                </button>
              </div>
            </div>

            <div className="admin-advertisement-active-test-offers">
              <h2>Tests with Active Offers</h2>
              {testsWithOffers.length === 0 ? (
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
        </>
      )}
    </div>
  );
};

export default AdminAdvertisement;