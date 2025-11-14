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
              <h1>Who should get Cardiac-CT?</h1>
            </div>
          </div>
          <div className="whyshouldCardiacCT-point">
            <p>
              Cardiac-CT is suitable for people at risk of heart disease or
              experiencing symptoms like chest pain. It is also helpful for
              those with high blood pressure, diabetes, or abnormal heart test
              results. Doctors may recommend it to check coronary arteries
              before planning treatment.
            </p>

            <div className="whyshouldCardiacCT-checklist">
              <ul>
                <li>Individuals with chest pain or shortness of breath</li>
                <li>
                  People with risk factors (BP, diabetes, smoking, family
                  history)
                </li>
                <li>
                  Patients with abnormal ECG/stress test or suspected artery
                  blockage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyshouldCardiacCT;
