import React, { useState } from "react";
import "./NerveExpectation.css";

const NerveExpectation = () => {
  const [activeSection, setActiveSection] = useState("before");

  const handleClick = (section) => {
    setActiveSection(section);
  };
  return (
    <div className="nerve-test-container">
      {/* <TiTick className="tick-icon" /> */}
      <h1>What to Expect Before, During & After a Nerve Conduction Test</h1>

      {/* Section Navigation */}
      <div className="nrv-section-nav">
        <button
          className={`nrv-section-button ${
            activeSection === "before" ? "active" : ""
          }`}
          onClick={() => handleClick("before")}
        >
          Before Test
        </button>
        <button
          className={`nrv-section-button ${
            activeSection === "during" ? "active" : ""
          }`}
          onClick={() => handleClick("during")}
        >
          During Test
        </button>
        <button
          className={`nrv-section-button ${
            activeSection === "after" ? "active" : ""
          }`}
          onClick={() => handleClick("after")}
        >
          After Test
        </button>
      </div>

      {/* Section Content */}
      <div className="nerve-test-sections">
        {/* Before the Test */}
        {activeSection === "before" && (
          <div className="nerve-test-section">
            <h2>Before the Test</h2>
            <ul>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Avoid Lotions/Creams:{" "}
                </span>
                Do not apply oils or creams on skin before the test.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Medication Update:
                </span>{" "}
                Inform the doctor about medicines and medical history.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Stay Warm:{" "}
                </span>
                Keep your body warm as cold can affect results.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Avoid Alcohol:{" "}
                </span>
                Do not drink alcohol 24 hours before the test.the test.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Wear Comfortable Clothes:{" "}
                </span>
                Wear loose clothes for easy electrode placement.{" "}
              </li>
            </ul>
          </div>
        )}

        {/* During the Test */}
        {activeSection === "during" && (
          <div className="nerve-test-section">
            <h2>During the Test</h2>
            <ul>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Electrode Placement:{" "}
                </span>
                Small electrodes are placed on the skin.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Mild Electrical Pulses:{" "}
                </span>
                Small signals are given to test nerve activity.{" "}
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Stay Still:{" "}
                </span>
                You need to remain relaxed and still.{" "}
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Sensation:{" "}
                </span>
                You may feel mild tingling or tapping sensation
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Test Duration:{" "}
                </span>
                The test usually takes 20–30 minutes.{" "}
              </li>
            </ul>
          </div>
        )}

        {/* After the Test */}
        {activeSection === "after" && (
          <div className="nerve-test-section">
            <h2>After the Test</h2>
            <ul>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Resume Normal Activities:
                </span>
                You can continue your routine right away.{" "}
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  No Recovery Time:
                </span>{" "}
                There is no downtime or major side effects.
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Clean Skin:
                </span>{" "}
                Wipe off electrode gel if needed{" "}
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Results Discussion:
                </span>{" "}
                Doctor will explain the results later.{" "}
              </li>
              <li>
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {" "}
                  Follow Medical Advice:
                </span>{" "}
                Continue treatment if recommended.{" "}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NerveExpectation;
