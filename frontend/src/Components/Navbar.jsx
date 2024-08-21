import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../css/Navbar.css';
import logo from '../images/logo.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
            <h4 className="attendance">Time Attendance</h4>
            <button className="ms-auto btn btn-dark">
            <Link to="/employee_signup" className="text-white text-decoration-none">
                Employee Signup
            </Link>
            </button>
        </nav>
    );
};

export default Navbar;
