import React, { useState } from "react";
import "./login.css";
import loginimg from "./logSigimg.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../utils/Url";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
const { login } = useAuth(); // Add setUser here

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle Phone Number Submission for OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mobile, name, email } = formData;

    // Validate mobile number
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Basic email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/person/send-otp`,
        {
          mobile,
          name,
          email,
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        setShowOtp(true);
        toast.info("OTP has been sent to your mobile.", {
          position: "top-right",
        });
      } else {
        toast.error(response.data.error || "Failed to send OTP", {
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to send OTP. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
      });
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 4) {
    toast.error("Please enter a valid 4-digit OTP");
    return;
  }

  setIsVerifying(true);

  try {
    const { mobile, name, email } = formData;
    const response = await axios.post(`${BACKEND_URL}/person/verify-otp`,{ mobile, otp, name, email });

    toast.success("Login successful!");
   login(response.data.token, response.data.user);         // ✅ Save user in context + localStorage
    navigate("/");                        // ✅ Go to homepage
  } catch (err) {
    toast.error(err.response?.data?.error || "Invalid OTP");
  } finally {
    setIsVerifying(false);
  }
};

  // Resend OTP
 const handleResendOtp = async () => {
  try {
    const { mobile, name, email } = formData;
    setErrorMessage(""); // Clear any previous errors
    
    // Show loading state
    setIsVerifying(true);
    
    const response = await axios.post(
      `${BACKEND_URL}/person/send-otp`,
      { mobile, name, email },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      setOtp(""); // Clear the OTP input field
      toast.success("OTP has been resent successfully!", {
        position: "top-right",
      });
    } else {
      throw new Error(response.data.error || "Failed to resend OTP");
    }
  } catch (err) {
    console.error("Error resending OTP:", err);
    const errorMsg = err.response?.data?.error || 
                    err.message || 
                    "Failed to resend OTP. Please try again.";
    
    setErrorMessage(errorMsg);
    toast.error(errorMsg, {
      position: "top-right",
    });
  } finally {
    setIsVerifying(false);
  }
};

  return (
    <div className="Login-main">
      <div className="Login-container">
        {/* Left Side - Image */}
        <div className="Login-image-container">
          <img src={loginimg} alt="Login Illustration" />
        </div>

        {/* Right Side - Form */}
        <div className="Login-form-container">
          <h2 className="Login-heading">User Login</h2>

          {!showOtp && !otpSent ? (
            <form className="Login-details-form" onSubmit={handleSubmit}>
              <div className="Login-form-group">
                <label htmlFor="name">Name (Optional)</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="Login-form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="Login-form-group">
                <label htmlFor="mobile">Mobile Number*</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Your Mobile Number (+91)"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* <p className="Login-create-account">
                Already have an account?{" "}
                <Link to="/log-in" className="create-account-link">
                  Login with OTP
                </Link>
              </p> */}

              <button type="submit" className="Login-submit-btn">
                Send OTP
              </button>
            </form>
          ) : (
            <div className="login-otp-form">
              <label htmlFor="otp" className="otp-label">
                Enter OTP*
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter the OTP"
                value={otp}
                onChange={handleOtpChange}
                required
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                  border: `1px solid ${isFocused ? "purple" : "gray"}`,
                  borderRadius: "5px",
                  padding: "10px",
                  width: "50%",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                  alignItems: "center",
                }}
              />
              <p className="resend-link" onClick={handleResendOtp}>
                Resend OTP
              </p>
              <button
                onClick={handleVerifyOtp}
                className="Login-verify-btn"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;