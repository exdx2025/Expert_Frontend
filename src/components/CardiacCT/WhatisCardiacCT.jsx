import React from "react";
import "./WhatisCardiacCT.css";
import img1 from "./eegimg8.jpeg";

const WhatisCardiacCT = () => {
  return (
    <div className="WhatisCardiacCT-container">
      <div className="WhatisCardiacCT-image">
        <img src={img1} alt="ENMG" />
      </div>
      <div className="WhatisCardiacCT-text">
        <h1>What is Cardiac-CT?</h1>
        <div className="WhatisCardiacCT-list">
          <p>
            Cardiac-CT is a non-invasive scan that uses X-rays to create
            detailed 3D images of the heart. It helps detect blockages, calcium
            buildup, and heart structure problems. The test is quick and often
            uses contrast dye to view coronary arteries clearly.{" "}
          </p>
          <div className="WhatisCardiacCT-scanlist">
            <ul>
              <li>
                <span className="check-icon">✔</span>
                Shows coronary artery blockages and plaque
              </li>
              <li>
                <span className="check-icon">✔</span>
                Checks heart structure, valves, and blood vessels
              </li>
              <li>
                <span className="check-icon">✔</span>
                Fast, accurate, and non-surgical procedure
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatisCardiacCT;
