import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="background-blur"></div>
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="welcome-message">
            Welcome to CAPEX Dashboard
            {role && (
              <span>
                , <span className="role-highlight-admin">{role}</span>
              </span>
            )}
          </div>
          <p className="description">
            CAPEX is a platform designed to manage capital expenditures efficiently. It provides tools for both
            administrators and employees to track, manage, and analyze expenses related to capital investments.
          </p>
          <p className="description">
            As an admin, you have access to manage user accounts, view and analyze CAPEX data, and monitor
            performance metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
