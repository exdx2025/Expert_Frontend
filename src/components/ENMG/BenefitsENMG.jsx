import React from "react";
import "./BenefitsENMG.css";
import img3 from "./eegimg9.jpeg";

const BenefitsENMG = () => {
  return (
    <div className="benefitsENMG-container">
      <div className="benefitsENMG-content">
        <div className="benefitsENMG-details">
          <div className="benefitsENMG-header">
            <h1>Benefits of Getting an Electroneuromyography</h1>
          </div>
          <div className="benefitsENMGlist">
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
        <div className="benefitsENMG-image">
          <img src={img3} alt="CT Scan" />
        </div>
      </div>
    </div>
  );
};

export default BenefitsENMG;
