// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Adjust path as needed
import "./Navbar.css"; // Create this CSS or move styles from Home.css

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/About" className="nav-link">About</Link>
      </div>
    </div>
  );
};

export default Navbar;
