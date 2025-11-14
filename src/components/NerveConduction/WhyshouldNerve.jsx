import React from "react";
import "./WhyshouldNerve.css";
import eegimg5 from "./eegimg5.png";

const WhyshouldNerve = () => {
  return (
    <div className="whyshouldNerve-main1">
      <div className="whyshouldNerve-main2">
        <div className="whyshouldNerve-box1">
          <div className="whyshouldNerve-box-image">
            <img src={eegimg5} alt="ultrasoundPreaper-Image" />
          </div>
        </div>
        <div className="whyshouldNerve-box2">
          <div className="whyshouldNerve-box2-write">
            <div className="whyshouldNerve-header">
              <h1>Who should get Nerve Conduction?</h1>
            </div>
          </div>
          <div className="whyshouldNerve-point">
            <p>
              Nerve conduction is recommended for individuals experiencing
              numbness, tingling, pain, or muscle weakness. It helps identify
              whether the issue is coming from the nerves or the muscles.
              Doctors use this test to detect conditions such as neuropathy or
              nerve compression.
            </p>

            <div className="whyshouldNerve-checklist">
              <ul>
                <li>People who experience frequent numbness, tingling, or burning pain in hands, legs, or feet</li>
                <li>Those with muscle weakness, cramps, or suspected nerve compression or injury</li>
                <li>Patients with diabetes or ongoing symptoms that may indicate nerve damage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyshouldNerve;
