// src/Components/Navbar.js

import React from 'react';
import '../css/Navbar.css'; // Path to your CSS file
import logo from '../images/logo.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
              <img src={logo} alt="Logo" />  
            </div>
            <h4 className="attendance">Time Attendance</h4>
        </nav>
    );
};

export default Navbar;
