import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewAdmins.css";
import { BACKEND_URL } from "../utils/Url";


function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
   
    axios
      .get(`${BACKEND_URL}/api/create-admin`) 
      .then((response) => {
        setAdmins(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching admins");
        setLoading(false);
      });
  }, []);

  return (
    <div className="view-admins-container">
      <h2>All Created Admins</h2>
      {loading ? (
        <p>Loading admins...</p>
      ) : error ? (
        <p>{error}</p>
      ) : admins.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>{admin.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No admins found</p>
      )}
    </div>
  );
}

export default ViewAdmins;
