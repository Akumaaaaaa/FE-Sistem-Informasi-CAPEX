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

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            showError("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            showError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        if (!validateEmail(email)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword
                }),
            });
            if (!response.ok) {
                const data = await response.json();
                showError(data.message);
            } else {
                const data = await response.json();
                showSuccess(data.message);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
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
                        maxLength={50}
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
                        maxLength={30}
                        required
                    />
                    <FaLock className="icon"/>
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        maxLength={30}
                        required
                    />
                    <FaLock className="icon"/>
                </div>

                <button type="submit">Register</button>

                <div className="login-link">
                    <p>Already have an account? <a href="/">Login</a></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;