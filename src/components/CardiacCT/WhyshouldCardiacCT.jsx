import React from "react";
import "./WhyshouldCardiacCT.css";
import eegimg5 from "./eegimg5.png";

const WhyshouldCardiacCT = () => {
  return (
    <div className="whyshouldCardiacCT-main1">
      <div className="whyshouldCardiacCT-main2">
        <div className="whyshouldCardiacCT-box1">
          <div className="whyshouldCardiacCT-box-image">
            <img src={eegimg5} alt="ultrasoundPreaper-Image" />
          </div>
        </div>
        <div className="whyshouldCardiacCT-box2">
          <div className="whyshouldCardiacCT-box2-write">
            <div className="whyshouldCardiacCT-header">
              <h1>Who should get Electroneuromyography?</h1>
            </div>
          </div>
          <div className="whyshouldCardiacCT-point">
            <p>
              Electroneuromyography (CardiacCT) is recommended for individuals
              experiencing unexplained muscle weakness, numbness, tingling, or
              pain. It helps doctors determine whether symptoms are caused by
              nerve damage, muscle disorders, or signal transmission issues.
            </p>

            <div className="whyshouldCardiacCT-checklist">
              <ul>
                <li>
                  Individuals with unexplained muscle weakness, numbness, or
                  tingling sensations.
                </li>
                <li>
                  People suspected of having nerve injuries, neuropathy, or
                  muscle disorders.
                </li>
                <li>
                  Patients with conditions like carpal tunnel syndrome,
                  sciatica, or nerve compression.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WhyshouldCardiacCT