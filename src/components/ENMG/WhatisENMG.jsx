import React from "react";
import "./WhatisENMG.css";
import img1 from "./eegimg8.jpeg";

const WhatisENMG = () => {
  return (
    <div className="WhatisENMG-container">
      <div className="WhatisENMG-image">
        <img src={img1} alt="ENMG" />
      </div>
      <div className="WhatisENMG-text">
        <h1>What is Electroneuromyography?</h1>
        <div className="WhatisENMG-list">
          <p>
            Electroneuromyography (ENMG) is a diagnostic test that records and
            analyzes the electrical activity of muscles and the nerves
            controlling them. It helps identify nerve injuries, muscle
            disorders, or issues with nerve-to-muscle communication for accurate
            diagnosis and treatment planning.{" "}
          </p>
          <div className="WhatisENMG-scanlist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Measures how well nerves transmit signals to muscles.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Helps diagnose conditions like neuropathy, myopathy, or nerve compression.
              </li>
              <li>
                <span className="check-icon">✔</span>
                Commonly used to evaluate muscle weakness, numbness, or tingling sensations.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatisENMG;
