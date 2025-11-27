import React from "react";
import Widget from "./Widget";
import TransactionTable from "./TransactionTable";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div className="widgets-container">
        <div className="widget-row">
          <Widget type="transaction" />
          <Widget type="general" />
        </div>

        <div className="widget-row">
          <Widget type="home" />
          <Widget type="appointment" />
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-placeholder">
          <h3>Analytics Charts</h3>
          <p>Revenue and performance charts will be displayed here</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
