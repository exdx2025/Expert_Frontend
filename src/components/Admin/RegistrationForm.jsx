import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./registrationForm.css";
import { BACKEND_URL } from "../utils/Url";

const RegistrationForm = () => {
  const services = [
    {
      id: "admin-general-registration",
      title: "General Registration",
      description: "Register for general laboratory services and tests"
    },
    {
      id: "admin-home-collection",
      title: "Home Collection",
      description: "Schedule sample collection from your home location"
    },
    {
      id: "admin-book-appointment",
      title: "Book Appointment",
      description: "Book an appointment for consultation or specific tests"
    }
  ];

  // Always have a service selected, default to first one
  const [formType, setFormType] = useState(services[0].id);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "",
    email: "",
    pincode: "",
    date: "",
    address: "",
    state: "",
    time: "",
    bookFor: "",
    clientName: "",
    doctorRef: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/${formType}`,
        formData
      );

      toast.success("Form submitted successfully!");
      console.log(response.data);

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        age: "",
        gender: "",
        email: "",
        pincode: "",
        date: "",
        address: "",
        state: "",
        time: "",
        bookFor: "",
        clientName: "",
        doctorRef: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error submitting the form");
    }
  };

  const handleServiceSelect = (serviceType) => {
    setFormType(serviceType);
  };

  return (
    <div className="adminreg-container">
      <div className="adminreg-header">
        <h1 className="adminreg-main-title">Registration Services</h1>
        <p className="adminreg-subtitle">Choose a service to get started</p>
      </div>

      {/* Service Selection Cards */}
      <div className="adminreg-services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className={`adminreg-service-card ${
              formType === service.id ? "adminreg-service-card-active" : ""
            }`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <div className="adminreg-service-icon">
              {service.title.charAt(0)}
            </div>
            <h3 className="adminreg-service-title">{service.title}</h3>
            {/* <div className="adminreg-service-arrow">→</div> */}
          </div>
        ))}
      </div>

      {/* Registration Form - Always visible since we always have a formType */}
      <div className="adminreg-form-section-simple">
        <div className="adminreg-form-header-simple">
          <h2 className="adminreg-form-title-simple">
            {services.find(s => s.id === formType)?.title} Form
          </h2>
          <div className="adminreg-form-underline"></div>
        </div>

        <form onSubmit={handleFormSubmit} className="adminreg-form-simple">
          <div className="adminreg-form-grid">
            {/* Personal Information Section */}
            <div className="adminreg-form-section-group">
              <h3 className="adminreg-section-title">Personal Information</h3>
              <div className="adminreg-form-row">
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Mobile Number *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div className="adminreg-form-row">
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="adminreg-select"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="adminreg-form-group">
                <label className="adminreg-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="adminreg-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="adminreg-form-section-group">
              <h3 className="adminreg-section-title">Additional Information</h3>
              
              <div className="adminreg-form-group">
                <label className="adminreg-label">Book For *</label>
                <input
                  type="text"
                  name="bookFor"
                  value={formData.bookFor}
                  onChange={handleInputChange}
                  className="adminreg-input"
                  placeholder="Who is this booking for?"
                  required
                />
              </div>

              <div className="adminreg-form-row">
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Doctor Reference</label>
                  <input
                    type="text"
                    name="doctorRef"
                    value={formData.doctorRef}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Doctor reference if any"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="adminreg-form-group">
                <label className="adminreg-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="adminreg-input"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="adminreg-form-row">
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter pincode"
                    required
                  />
                </div>
                <div className="adminreg-form-group">
                  <label className="adminreg-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="adminreg-form-row">
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="adminreg-input"
                    required
                  />
                </div>
                <div className="adminreg-form-group">
                  <label className="adminreg-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="adminreg-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="adminreg-form-actions">
            <button type="submit" className="adminreg-button-submit">
              Submit Registration
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;