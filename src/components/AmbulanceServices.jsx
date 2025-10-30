import React, { useState } from "react";
import "./ambulanceServices.css";
import ambulanceImage from "../components/assests/ambulance2.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../components/utils/Url";

const AmbulanceServices = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    gender: "",
    email: "",
    pickUpLocation: "",
    dropLocation: "",
    date: "",
    conditionTest: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }
    
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.email ||
      !formData.pickUpLocation ||
      !formData.dropLocation ||
      !formData.date
    ) {
      newErrors.general = "Please fill all required fields.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/ambulance-services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Ambulance service booked successfully!");
        setFormData({
          name: "",
          mobile: "",
          age: "",
          gender: "",
          email: "",
          pickUpLocation: "",
          dropLocation: "",
          date: "",
          conditionTest: false,
        });
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Error in requesting ambulance. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error in booking ambulance service. Please try again.");
    }

    setIsSubmitting(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  return (
    <div className="ambulance-services-main">
      <div className="ambulance-services-container">
        <div className="ambulance-services-image-container">
          <img src={ambulanceImage} alt="Ambulance Service" />
        </div>

        <div className="ambulance-services-form-container">
          <h2 className="ambulance-services-heading">
            Ambulance Service
          </h2>
          <p className="ambulance-services-subheading">
            Book our emergency ambulance service for safe and timely medical transportation
          </p>

          <form
            className="ambulance-services-details-form"
            onSubmit={handleSubmit}
          >
            <div className="ambulance-services-form-row">
              <div className="ambulance-services-form-group">
                <label htmlFor="name" className="ambulance-services-required">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Please Provide Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="ambulance-services-form-group">
                <label htmlFor="mobile" className="ambulance-services-required">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Your Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
                {errors.mobile && (
                  <span className="error-text">{errors.mobile}</span>
                )}
              </div>
            </div>

            <div className="ambulance-services-form-row">
              <div className="ambulance-services-form-group">
                <label htmlFor="age" className="ambulance-services-required">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Enter Your Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="ambulance-services-form-group">
                <label htmlFor="gender" className="ambulance-services-required">Gender</label>
                <select
                  className="ambulance-services-gender"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="ambulance-services-form-group">
              <label htmlFor="email" className="ambulance-services-required">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="ambulance-services-form-group">
              <label htmlFor="pickUpLocation" className="ambulance-services-required">Pick-Up Location</label>
              <input
                type="text"
                id="pickUpLocation"
                name="pickUpLocation"
                placeholder="Enter Pick-Up Location"
                value={formData.pickUpLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ambulance-services-form-group">
              <label htmlFor="dropLocation" className="ambulance-services-required">Drop Location</label>
              <input
                type="text"
                id="dropLocation"
                name="dropLocation"
                placeholder="Enter Drop Location"
                value={formData.dropLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ambulance-services-form-group">
              <label htmlFor="date" className="ambulance-services-required">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                min={getTodayDate()}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ambulance-services-condition">
              <label>
                #Condition Test Above 5000
              </label>
            </div>

            <button
              type="submit"
              className="ambulance-services-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Book Ambulance Service"}
            </button>
          </form>

          {errors.general && <div className="error-text">{errors.general}</div>}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AmbulanceServices;