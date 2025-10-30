import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DownloadReport.css";
import HospitalImage from "./assests/doctorGroup.jpg";
import { MdDownload, MdPersonAdd } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DownloadReport() {
  const [patients, setPatients] = useState([
    "Test1",
    "Test2",
    "Test3",
    "Test4",
    "Test",
  ]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [newPatient, setNewPatient] = useState("");
  const [isReportDownloaded, setIsReportDownloaded] = useState(false);

  const navigate = useNavigate();

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleReportChange = (e) => setSelectedReport(e.target.value);
  const handlePatientChange = (e) => setSelectedPatient(e.target.value);
  const handleNewPatientAdd = () => {
    if (newPatient.trim() === "") {
      toast.error("Patient name cannot be empty!");
      return;
    }
    setPatients([...patients, newPatient]);
    setNewPatient("");
    toast.success("Patient added successfully!");
  };

  const handleDownload = () => {
    if (!selectedPatient || !selectedReport || !selectedDate) {
      toast.error("Please select all fields!");
      return;
    }

    const fileURL =
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const fileName = `${selectedReport}-${selectedPatient}-${selectedDate}.pdf`;

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = fileName;
    link.click();
    setIsReportDownloaded(true);
    toast.success(`${fileName} downloaded successfully!`);
  };

  return (
    <div className="download-report-wrapper">
      <div className="left-section">
        <img src={HospitalImage} alt="Hospital" className="hospital-image" />
      </div>
      <div className="right-section">
        <h1>Download Your Medical Reports</h1>

        <div className="form-group">
          <label htmlFor="new-patient">Patient Name:</label>
          <div className="add-patient">
            <input
              type="text"
              id="new-patient"
              value={newPatient}
              onChange={(e) => setNewPatient(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>

          <label htmlFor="new-patient">Patient Email:</label>
          <div className="add-patient">
            <input
              type="text"
              id="new-patient"
              value={newPatient}
              onChange={(e) => setNewPatient(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>

          <label htmlFor="new-patient">Patient Phone:</label>
          <div className="add-patient">
            <input
              type="text"
              id="new-patient"
              value={newPatient}
              onChange={(e) => setNewPatient(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="date-picker">Select Date:</label>
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="actions">
          <button onClick={handleDownload} className="download-btnn">
            <MdDownload className="download-icon" />
            Download Report
          </button>
          <button onClick={() => navigate("/")} className="back-btnn">
            Back to Main Page
          </button>
        </div>
        {isReportDownloaded && (
          <p className="success-message">Report downloaded successfully!</p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default DownloadReport;
