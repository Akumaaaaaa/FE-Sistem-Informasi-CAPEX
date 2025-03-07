import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import './sidebar.css';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'karyawan') {
      return '/dashboard/karyawan';
    } else if (role === 'admin') {
      return '/dashboard/admin';
    } else {
      return '/';
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="CAPEX Logo" className="logo" />
        <h1>CAPEX</h1>
      </div>
      <ul className="menu">
        <li
          className={currentPath === getDashboardPath() ? 'active' : ''}
          onClick={() => navigate(getDashboardPath())}
        >
          <i className='bx bxs-home'></i> Home
        </li>
        {role === 'admin' && (
          <>
            <li
              className={currentPath === '/dashboard/admin/manage-accounts' ? 'active' : ''}
              onClick={() => navigate('/dashboard/admin/manage-accounts')}
            >
              <i className='bx bxs-user-account'></i> Manage Accounts
            </li>
            
          </>
        )}
        <li
          className={currentPath === '/capex' ? 'active' : ''}
          onClick={() => navigate('/capex')}
        >
          <i className='bx bxs-folder'></i> CAPEX Data
        </li>
        <li
          className={currentPath === '/performance' ? 'active' : ''}
          onClick={() => navigate('/performance')}
        >
          <i className='bx bxs-bar-chart-alt-2'></i> Performance
        </li>
      </ul>
      <ul className="menu-bottom">
        <li className="logout" onClick={handleLogout}>
          <i className='bx bxs-log-out'></i> Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;