import React from "react";
import "./WhatisNerve.css";
import img1 from "./eegimg8.jpeg";

const WhatisNerve = () => {
  return (
    <div className="WhatisNerve-container">
      <div className="WhatisNerve-image">
        <img src={img1} alt="MRI Scan" />
      </div>
      <div className="WhatisNerve-text">
        <h1>What is Nerve Conduction?</h1>
        <div className="WhatisNerve-list">
          <p>
            Nerve Conduction is a diagnostic test that measures how quickly
            electrical signals move through the nerves. It helps identify nerve
            damage, weakness, or disorders affecting nerve function. The test
            uses mild electrical impulses and is safe and commonly used by
            doctors.{" "}
          </p>
          <div className="WhatisNerve-scanlist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Checks speed and strength of nerve signals
              </li>
              <li>
                <span className="check-icon">✔</span>
                Helps diagnose nerve disorders like neuropathy and carpal tunnel
              </li>
              <li>
                <span className="check-icon">✔</span>
                Quick, safe, and non-invasive procedure
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatisNerve;
