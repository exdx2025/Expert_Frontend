import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "./viewAppointment.css";
import { BACKEND_URL } from "../utils/Url";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/book-appointment`);

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
          setFilteredAppointments(data);
        } else {
          setError("Failed to fetch appointments.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("An error occurred while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase().trim();
    setSearchTerm(value);

    if (value === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) => {
        return (
          (appointment.name &&
            appointment.name.toLowerCase().includes(value)) ||
          (appointment.email &&
            appointment.email.toLowerCase().includes(value)) ||
          (appointment.mobile && appointment.mobile.includes(value))
        );
      });

      setFilteredAppointments(filtered);
    }
  };

  const handleExportToExcel = () => {
    const transformedData = filteredAppointments.map((appointment, index) => ({
      "S.No": index + 1,
      Name: appointment.name,
      Email: appointment.email,
      Mobile: appointment.mobile,
      Address: appointment.address,
      "Pin Code": appointment.pinCode,
      State: appointment.state,
      Gender: appointment.gender,
      "Book For": appointment.bookFor,
    }));

    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, "appointments_list.xlsx");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div className="viewAppointments-container">
      <h2>Book Appointments List</h2>

      <div className="filter-actions">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Name, Email, or Mobile"
          className="search-filter"
        />
        <button onClick={handleExportToExcel} className="export-button">
          Export to Excel
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Pin Code</th>
              <th>State</th>
              <th>Gender</th>
              <th>Book For</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.name}</td>
                <td>{appointment.email}</td>
                <td>{appointment.mobile}</td>
                <td>{appointment.address}</td>
                <td>{appointment.pinCode}</td>
                <td>{appointment.state}</td>
                <td>{appointment.gender}</td>
                <td>{appointment.bookFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAppointments;
