import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "./bookingList.css";
import { BACKEND_URL } from "../utils/Url";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/bookings`);
      const bookingsData = response.data;
      setBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const transformedData = bookings.map((booking, index) => ({
      "S.No": index + 1,
      Name: booking.name,
      "Mobile Number": booking.mobileNumber,
      "Appointment Date": formatDate(booking.appointmentDate),
      Pincode: booking.pincode,
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(value.toLowerCase()) ||
        booking.mobileNumber.includes(value)
    );
    setFilteredBookings(filtered);
  };

  const handleDateFilter = (event) => {
    const value = event.target.value;
    setSelectedDate(value);

    const filtered = bookings.filter(
      (booking) => booking.appointmentDate.split("T")[0] === value
    );
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchTerm || selectedDate) {
      const filtered = bookings.filter((booking) => {
        const matchSearch =
          booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.mobileNumber.includes(searchTerm);
        const matchDate = selectedDate
          ? booking.appointmentDate.split("T")[0] === selectedDate
          : true;
        return matchSearch && matchDate;
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, selectedDate, bookings]);

  return (
    <div className="booking-list-container">
      <h2>Book Now List</h2>
      <div className="actions">
        <button onClick={exportToExcel} className="book-export-button">
          Export to Excel
        </button>
        <a href="/admin/dashboard" className="back-button">
          &larr; Back to Dashboard
        </a>
      </div>

      <div className="filter-container">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilter}
          placeholder="Filter by Date"
          className="book-date-filter"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Name or Mobile Number"
          className="search-filter"
        />
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Appointment Date</th>
                <th>Pincode</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.name}</td>
                  <td>{booking.mobileNumber}</td>
                  <td>{formatDate(booking.appointmentDate)}</td>{" "}
                  <td>{booking.pincode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingList;
