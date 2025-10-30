// components/Admin/TransactionTable.jsx
import React, { useEffect, useState } from "react";
import "./TransactionTable.css";
import { BACKEND_URL } from "../utils/Url";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin-carts`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Flatten carts -> tests
  const allRows = transactions.flatMap((cart) =>
    cart.tests?.map((test, index) => ({
      id: `${cart._id}-${index}`,
      phone: cart.userMobile || "N/A", // ✅ phone instead of testId
      testName: test.testName || "Unknown Test",
      customer: cart.userName || "Unknown User",
      date: new Date(cart.createdAt),
      amount: test.price * (test.quantity || 1),
      paymentMethod: cart.paymentMethod || "N/A",
      status: cart.status || "pending",
    }))
  );

  // Apply filters
  const filteredRows = allRows.filter((row) => {
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    const matchesDate = dateFilter
      ? row.date.toISOString().split("T")[0] === dateFilter
      : true;
    return matchesStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading)
    return <div className="table-container">Loading transactions…</div>;
  if (error) return <div className="table-container error">{error}</div>;

  return (
    <div className="table-container">
      <h2 className="table-title">Patient Registration</h2>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>Status: </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label>Date: </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th className="table-header">Phone No</th>
            <th className="table-header">Test Name</th>
            <th className="table-header">Customer</th>
            <th className="table-header">Date</th>
            <th className="table-header">Amount</th>
            {/* <th className="table-header">Payment Method</th> */}
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No transactions found
              </td>
            </tr>
          ) : (
            paginatedRows.map((row) => (
              <tr key={row.id} className="table-row">
                <td className="table-cell">{row.customer}</td>
                <td className="table-cell">{row.phone}</td>
                <td className="table-cell">{row.testName}</td>
                <td className="table-cell">{row.date.toLocaleDateString()}</td>
                <td className="table-cell">₹{row.amount.toLocaleString()}</td>
                {/* <td className="table-cell">{row.paymentMethod}</td> */}
                <td className="table-cell">
                  <span className={`status ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
