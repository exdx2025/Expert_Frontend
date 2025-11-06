import React from "react";
import "./BenefitsCardiacCT.css";
import img3 from "./eegimg9.jpeg";

const BenefitsCardiacCT = () => {
  return (
    <div className="benefitsCardiacCT-container">
      <div className="benefitsCardiacCT-content">
        <div className="benefitsCardiacCT-details">
          <div className="benefitsCardiacCT-header">
            <h1>Benefits of Getting an Electroneuromyography</h1>
          </div>
          <div className="benefitsCardiacCTlist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Accurate Diagnosis: Helps identify the exact location and type
                of nerve or muscle damage.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Early Detection: Detects neuromuscular disorders in their early
                stages for timely treatment.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Guides Treatment: Provides valuable data to plan effective
                therapies or surgeries.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Monitors Progress: Tracks recovery and treatment effectiveness
                over time.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Differentiates Conditions: Distinguishes between nerve-related
                and muscle-related problems.
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


export default BenefitsCardiacCT