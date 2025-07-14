import React from "react";
import { useNavigate , Link} from "react-router-dom";
import logo from "../src/assets/logo.jpg"; // Add your logo path
// import backgroundImage from "../assets/background.jpg"; // Add your background image path
import "./Home.css"; // Import the new CSS file

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <a href="./About">About</a>
        </div>
      </div>

      {/* Title */}
      <h1 className="title">SELF AUDIOMETRIC TEST</h1>

      {/* Test Info Box */}
      <div className="overlay-box">
        <p className="text">
          Are you noticing any changes in your hearing??
        </p>
        <p className="text-sm">
          Test your hearing in just 5 mins
        </p>
        <button
          className="test-button"
          onClick={() => navigate("/EarSelection")}
        >
          Test Now
        </button>
      </div>
    </div>
  );
};

export default Home;
