import React from "react";
import { useNavigate } from "react-router-dom";
const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-wrapper">
      <div className="about-content">
        <h1 className="about-title">About the Self-Audiometric Test</h1>

        <p className="about-text">
          This website provides a self-audiometric test using Pure-Tone Audiometry,
          allowing users to evaluate their hearing thresholds. The test involves
          listening to tones at different frequencies and volume levels and plotting
          results on an audiogram.
        </p>

        <h2 className="about-subtitle">🔹 How It Works:</h2>
        <ul className="about-list">
          <li>Select Left, Right, or Both ears for testing.</li>
          <li>Listen to tones at various frequencies (125Hz - 8000Hz).</li>
          <li>Mark the lowest audible volume (threshold) for each frequency.</li>
          <li>Your audiogram is generated, indicating potential hearing loss.</li>
        </ul>

        <h2 className="about-subtitle">🔹 Features:</h2>
        <ul className="about-list">
          <li>Pure-Tone Audiometry based testing.</li>
          <li>Ability to select ears (left/right).</li>
          <li>Generates audiogram graph dynamically.</li>
          <li>Downloadable test results for future reference.</li>
          <li>Ensures a quiet environment by detecting ambient noise.</li>
        </ul>

        <h2 className="about-subtitle">🔹 Important Note:</h2>
        <p className="about-text">
          For accurate results, use wired or Bluetooth headphones in a quiet environment.
          This test is not a medical diagnosis—consult an audiologist if you suspect hearing loss.
        </p>

        <h2 className="about-subtitle">📩 Contact Us:</h2>
        <p className="about-text">
          Have questions or feedback? Reach out to us at:
          <span className="about-email"> takecare@health.com</span>
        </p>

        <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default About;
