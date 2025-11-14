import React from "react";
import "./BenefitsNerve.css";
import img3 from "./eegimg9.jpeg";

const BenefitsNerve = () => {
  return (
    <div className="benefitsNerve-container">
      <div className="benefitsNerve-content">
        <div className="benefitsNerve-details">
          <div className="benefitsNerve-header">
            <h1>Benefits of Getting an Nerve Conduction</h1>
          </div>
          <div className="benefitsNervelist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Helps identify damaged or weakened nerves caused by injuries or
                medical conditions.
              </li>
              <li>
                <span className="check-icon">✔</span> Assists in diagnosing
                conditions like carpal tunnel syndrome, sciatica, and peripheral
                neuropathy.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Measures how well electrical signals travel through nerves to
                assess their performance.
              </li>
              <li>
                <span className="check-icon">✔</span> Helps doctors track nerve
                recovery during ongoing treatment or therapy.
              </li>
              <li>
                <span className="check-icon">✔</span> Supports diagnosis of
                nerve-related muscle weakness or disorders affecting
                nerve-muscle communication.
              </li>
            </ul>
          </div>
        </div>
        <div className="benefitsNerve-image">
          <img src={img3} alt="CT Scan" />
        </div>
      </div>
    </div>
  );
};

export default BenefitsNerve;
