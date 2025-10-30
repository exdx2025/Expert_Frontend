// components/Admin/Dashboard.jsx
import React from 'react';
import Widget from './Widget';
import TransactionTable from './TransactionTable';
import RegistrationForm from './RegistrationForm';
import FetchRegistrations from './FetchRegistrations';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      {/* Widget Section - Using your existing grid structure */}
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

      {/* Charts Section - Keeping your existing structure */}
      <div className="charts-container">
        <div className="chart-placeholder">
          <h3>Analytics Charts</h3>
          <p>Revenue and performance charts will be displayed here</p>
        </div>
      </div>

      {/* Main Content - Adding your components */}
      <div className="dashboard-content">
        <div className="content-section">
          <TransactionTable />
        </div>
        
        {/* <div className="content-section">
          <RegistrationForm />
        </div>
        
        <div className="content-section">
          <FetchRegistrations />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;