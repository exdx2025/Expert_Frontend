// components/Admin/Widget.jsx - Alternative Version
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../utils/Url";
import "./Widget.css";

const Widget = ({ type }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  let data;

  // Fetch all registrations and filter by type
  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Fetch all registrations from the main endpoint
        const response = await axios.get(`${BACKEND_URL}/api/admin-registrations`);
        console.log('All registrations:', response.data); // Debug log
        
        let filteredCount = 0;
        
        switch (type) {
          case "transaction":
            // For transactions, fetch from carts endpoint
            const cartsResponse = await axios.get(`${BACKEND_URL}/api/admin-carts`);
            const totalTests = cartsResponse.data.reduce((total, cart) => 
              total + (cart.tests?.length || 0), 0
            );
            filteredCount = totalTests;
            break;
            
          case "general":
            // Count general registrations
            filteredCount = response.data.filter(reg => 
              reg.serviceName === 'General Registration' || 
              reg.formType === 'admin-general-registration'
            ).length;
            break;
            
          case "home":
            // Count home collections
            filteredCount = response.data.filter(reg => 
              reg.serviceName === 'Home Collection' || 
              reg.formType === 'admin-home-collection'
            ).length;
            break;
            
          case "appointment":
            // Count appointments
            filteredCount = response.data.filter(reg => 
              reg.serviceName === 'Book Appointment' || 
              reg.formType === 'admin-book-appointment'
            ).length;
            break;
            
          default:
            filteredCount = response.data.length;
        }
        
        setCount(filteredCount);
        
      } catch (error) {
        console.error(`Error fetching ${type} count:`, error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [type]);

  // ... rest of the component remains the same as above
  switch (type) {
    case "transaction":
      data = {
        title: "TRANSACTIONS",
        isMoney: false,
        link: "See all transactions",
        icon: (
          <i className="fas fa-receipt icon" style={{
            color: "crimson",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }}></i>
        ),
      };
      break;
    case "general":
      data = {
        title: "GENERAL REGISTRATION",
        isMoney: false,
        link: "View all registrations",
        icon: (
          <i className="fas fa-user-plus icon" style={{
            backgroundColor: "rgba(218, 165, 32, 0.2)",
            color: "goldenrod",
          }}></i>
        ),
      };
      break;
    case "home":
      data = {
        title: "HOME COLLECTION",
        isMoney: false,
        link: "View home collections",
        icon: (
          <i className="fas fa-home icon" style={{ 
            backgroundColor: "rgba(0, 128, 0, 0.2)", 
            color: "green" 
          }}></i>
        ),
      };
      break;
    case "appointment":
      data = {
        title: "BOOK APPOINTMENT",
        isMoney: false,
        link: "See all appointments",
        icon: (
          <i className="fas fa-calendar-check icon" style={{
            backgroundColor: "rgba(128, 0, 128, 0.2)",
            color: "purple",
          }}></i>
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {loading ? "..." : count.toLocaleString()}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <i className="fas fa-users"></i>
          Patients
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;