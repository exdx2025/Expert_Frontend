import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./fetchRegistration.css";
import { BACKEND_URL } from "../utils/Url";

const FetchRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/admin-registrations`
        );
        setRegistrations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRegistrations = registrations.filter((registration) => {
    const matchesDate = dateFilter ? registration.date === dateFilter : true;
    const matchesSearch = registration.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRegistrations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "registrations.xlsx");
  };

  return (
    <div className="fetch-container">
      <div className="fetch-title">Registrations</div>

      <div className="filter-container">
        <input
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className="date-filter"
        />
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="search-input"
        />

        <button className="excel-button" onClick={handleExportToExcel}>
          Export to Excel
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="fetch-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Pincode</th>
              <th>Address</th>
              <th>State</th>
              <th>Date</th>
              <th>Time</th>
              <th>Book For</th>
              <th>Services</th>
              <th>Client Name</th>
              <th>Doctor Reference</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((registration, index) => (
              <tr key={index}>
                <td>{registration.name}</td>
                <td>{registration.mobile}</td>
                <td>{registration.age}</td>
                <td>{registration.gender}</td>
                <td>{registration.email}</td>
                <td>{registration.pincode}</td>
                <td>{registration.address}</td>
                <td>{registration.state}</td>
                <td>{registration.date}</td>
                <td>{registration.time}</td>
                <td>{registration.bookFor}</td>
                <td>{registration.serviceName}</td>
                <td>{registration.clientName}</td>
                <td>{registration.doctorRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FetchRegistrations;
