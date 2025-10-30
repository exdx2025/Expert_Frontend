import React, { useState } from "react";
import "./BookAppointment.css";
import bookAppointment from "./assests/bookappointment.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../components/utils/Url";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    pinCode: "",
    state: "",
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
        `${BACKEND_URL}/api/book-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Appointment booked successfully!");

        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
          pinCode: "",
          state: "",
          gender: "",
          bookFor: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Error in booking appointment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error in booking appointment. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bookAppointment-main">
      <div className="bookAppointment-container">
        <div className="bookAppointment-image-container">
          <img src={bookAppointment} alt="Book Appointment Illustration" />
        </div>

        <div className="bookAppointment-form-container">
          <h2 className="bookAppointment-heading">Book Appointment</h2>
          <p className="bookAppointment-subheading">
            Schedule your appointment with our healthcare professionals
          </p>

          <form
            className="bookAppointment-details-form"
            onSubmit={handleSubmit}
          >
            <div className="bookAppointment-form-row">
              <div className="bookAppointment-form-group">
                <label htmlFor="name" className="bookAppointment-required">Name</label>
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
              
              <div className="bookAppointment-form-group">
                <label htmlFor="gender" className="bookAppointment-required">Gender</label>
                <select
                  className="bookAppointment-gender"
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

            <div className="bookAppointment-form-group">
              <label htmlFor="bookFor" className="bookAppointment-required">Book For</label>
              <select
                className="bookAppointment-bookNow"
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

            <div className="bookAppointment-form-row">
              <div className="bookAppointment-form-group">
                <label htmlFor="email" className="bookAppointment-required">Email</label>
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
              
              <div className="bookAppointment-form-group">
                <label htmlFor="mobile" className="bookAppointment-required">Mobile Number</label>
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

            <div className="bookAppointment-form-group">
              <label htmlFor="address" className="bookAppointment-required">Address</label>
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

            <div className="bookAppointment-form-row">
              <div className="bookAppointment-form-group">
                <label htmlFor="pinCode" className="bookAppointment-required">Pin Code</label>
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
              
              <div className="bookAppointment-form-group">
                <label htmlFor="state" className="bookAppointment-required">State</label>
                <select
                  className="bookAppointment-state"
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

            <button
              type="submit"
              className="bookAppointment-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
            </button>
          </form>

          {errors.general && <div className="error-text">{errors.general}</div>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookAppointment;