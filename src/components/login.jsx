import React, { useState } from "react";
import './auth.css';
import { FaUserCircle, FaLock } from "react-icons/fa";
import Swal from 'sweetalert2';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
    icon: 'colored-toast',
    title: 'colored-toast',
    htmlContainer: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true
});

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
          showError("Please enter both email and password");
          return;
      }
  
      try {
          const response = await fetch('http://localhost:3000/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email,
                  password
              }),
          });
          if (!response.ok) {
              throw new Error('Invalid email or password');
          }
          const data = await response.json();
          const { token, role } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          showSuccess('Login successful');
  
          if (role === 'karyawan') {
              navigate('/dashboard/karyawan');
          } else if (role === 'admin') {
              navigate('/dashboard/admin');
          } else {
              showError('Invalid user role');
          }
      } catch (error) {
          showError(error.message);
      }
  };  

    const showError = (message) => {
        Toast.fire({
            icon: 'error',
            title: message
        });
    };

    const showSuccess = (message) => {
        Toast.fire({
            icon: 'success',
            title: message
        });
    };

    return (
        <div className="wrapper">
            <header>
                <img src={logo} alt="CAPEX Logo" className="logo" />
                <h2>CAPEX Management</h2>
                <p>Integrated Information System to Monitor and Manage CAPEX Digitally</p>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUserCircle className="icon"/>
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className="icon"/>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;