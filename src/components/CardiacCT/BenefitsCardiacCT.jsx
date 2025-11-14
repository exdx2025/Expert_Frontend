import React from "react";
import "./BenefitsCardiacCT.css";
import img3 from "./eegimg9.jpeg";

const BenefitsCardiacCT = () => {
  return (
    <div className="benefitsCardiacCT-container">
      <div className="benefitsCardiacCT-content">
        <div className="benefitsCardiacCT-details">
          <div className="benefitsCardiacCT-header">
            <h1>Benefits of Getting an Cardiac-CT</h1>
          </div>
          <div className="benefitsCardiacCTlist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Early detection of coronary artery blockages and heart disease
              </li>
              <li>
                <span className="check-icon">✔</span>
                Provides clear, high-resolution 3D images of the heart
              </li>
              <li>
                <span className="check-icon">✔</span>
                Non-invasive and faster than traditional angiography
              </li>
              <li>
                <span className="check-icon">✔</span>
                Helps assess calcium buildup and heart attack risk
              </li>
              <li>
                <span className="check-icon">✔</span>
                Aids doctors in planning treatment and preventive care early
              </li>
            </ul>
          </div>
        </div>
        <div className="benefitsCardiacCT-image">
          <img src={img3} alt="CT Scan" />
        </div>
      </div>
    </div>
  );
};

export default BenefitsCardiacCT;
