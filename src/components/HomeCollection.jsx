import React, { useState } from "react";
import "./HomeCollection.css";
import homecollection from "./assests/homecc.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assests/h1.png";
import img2 from "./assests/h2.png";
import img3 from "./assests/h3.png";
import img4 from "./assests/h4.png";
import img5 from "./assests/h5.png";
import { BACKEND_URL } from "../components/utils/Url";

const steps = [
  { id: 1, text: "Enter your address and preferred time", img: img1 },
  { id: 2, text: "Make online payment on website or at your home", img: img2 },
  { id: 3, text: "Our executive will confirm your appointment", img: img3 },
  { id: 4, text: "Get tested at the comfort of your home", img: img4 },
  { id: 5, text: "Get your test report", img: img5 },
];

const HomeCollection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    pinCode: "",
    state: "",
    date: "",
    time: "",
    gender: "",
    bookFor: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    pinCode: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (formData.pinCode.length !== 6) {
      newErrors.pinCode = "Pin Code must be 6 digits.";
    }
    if (
      !formData.name ||
      !formData.address ||
      !formData.state ||
      !formData.date ||
      !formData.time ||
      !formData.gender ||
      !formData.bookFor
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
        `${BACKEND_URL}/api/home-collection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
          pinCode: "",
          state: "",
          date: "",
          time: "",
          gender: "",
          bookFor: "",
        });
      } else {
        toast.error("Error in submitting form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error in submitting form. Please try again.");
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
    <div className="HomeCollection-main">
      <div className="HomeCollection-main2">
        <div>
          <h2 className="HomeCollection-heading">Home Collection</h2>
        </div>
        
        <div className="HomeCollection-steps">
          {steps.map((step) => (
            <div key={step.id} className="step">
              <div className="circle">
                <img src={step.img} alt={`Step ${step.id}`} />
              </div>
              <div className="step-content">
                <h4>Step {step.id}</h4>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="HomeCollection-container">
        <div className="HomeCollection-image-container">
          <img src={homecollection} alt="Home Collection Service" />
        </div>

        <div className="HomeCollection-form-container">
          <form className="HomeCollection-details-form" onSubmit={handleSubmit}>
            <div className="HomeCollection-form-row">
              <div className="HomeCollection-form-group">
                <label htmlFor="name" className="HomeCollection-required">Name</label>
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
              
              <div className="HomeCollection-form-group">
                <label htmlFor="gender" className="HomeCollection-required">Gender</label>
                <select
                  className="HomeCollection-gender"
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
                {errors.gender && (
                  <span className="error-text">{errors.gender}</span>
                )}
              </div>
            </div>

            <div className="HomeCollection-form-group">
              <label htmlFor="bookFor" className="HomeCollection-required">Book For</label>
              <select
                className="HomeCollection-bookNow"
                id="bookFor"
                name="bookFor"
                value={formData.bookFor}
                onChange={handleChange}
                required
              >
                <option value="">Select Option</option>
                <option value="own">Own</option>
                <option value="relative">Relative/Guardians</option>
              </select>
              {errors.bookFor && (
                <span className="error-text">{errors.bookFor}</span>
              )}
            </div>

            <div className="HomeCollection-form-row">
              <div className="HomeCollection-form-group">
                <label htmlFor="email" className="HomeCollection-required">Email</label>
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
              
              <div className="HomeCollection-form-group">
                <label htmlFor="mobile" className="HomeCollection-required">Mobile Number</label>
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

            <div className="HomeCollection-form-group">
              <label htmlFor="address" className="HomeCollection-required">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Please Provide Your Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && (
                <span className="error-text">{errors.address}</span>
              )}
            </div>

            <div className="HomeCollection-form-row">
              <div className="HomeCollection-form-group">
                <label htmlFor="pinCode" className="HomeCollection-required">Pin Code</label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  placeholder="Enter Pin Code"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
                {errors.pinCode && (
                  <span className="error-text">{errors.pinCode}</span>
                )}
              </div>
              
              <div className="HomeCollection-form-group">
                <label htmlFor="state" className="HomeCollection-required">State</label>
                <select
                  className="HomeCollection-state"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Karnataka">Karnataka</option>
                  {/* Add more states here */}
                </select>
                {errors.state && (
                  <span className="error-text">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="date-time-container">
              <div className="date-time-item">
                <label htmlFor="date" className="HomeCollection-required">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={getTodayDate()}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {errors.date && (
                  <span className="error-text">{errors.date}</span>
                )}
              </div>
              
              <div className="date-time-item">
                <label htmlFor="time" className="HomeCollection-required">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  step="3600"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                {errors.time && (
                  <span className="error-text">{errors.time}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="HomeCollection-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Book Home Collection"}
            </button>
          </form>

          {errors.general && <div className="error-text">{errors.general}</div>}
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default HomeCollection;