import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import leftEarImg from "./assets/left-ear.png";
import rightEarImg from "./assets/right-ear.png";
import bothEarsImg from "./assets/both-ears.png";
import './styles.css';

const EarSelection = () => {
  const [selectedEar, setSelectedEar] = useState("");
  const [headphonesConnected, setHeadphonesConnected] = useState(false);
  const [isQuiet, setIsQuiet] = useState(false);
  const [ambientNoise, setAmbientNoise] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkHeadphones = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === "audiooutput");
        const hasHeadphones = audioOutputs.some(device => device.label.toLowerCase().includes("headphone") || device.label.toLowerCase().includes("bluetooth"));
        setHeadphonesConnected(hasHeadphones);
      } catch (error) {
        console.error("Error checking media devices:", error);
      }
    };

    checkHeadphones();
    navigator.mediaDevices.addEventListener("devicechange", checkHeadphones);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", checkHeadphones);
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkNoiseLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const avgNoise = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAmbientNoise(avgNoise);
          setIsQuiet(avgNoise < 40);
        };

        setInterval(checkNoiseLevel, 1000);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  }, []);

  const isTestEnabled = selectedEar && headphonesConnected && isQuiet;

  const handleTakeTest = () => {
    localStorage.removeItem("leftEarData");
    localStorage.removeItem("rightEarData");
    localStorage.setItem("selectedEar", selectedEar);
    navigate("/test");
  };

  return (
    <div className="earselection-wrapper">
      <div className="container">
        <h2 className="sec-title">Select Ear for Testing</h2>

        <div className="ear-selection">
          <div className={`ear-option ${selectedEar === "Left" ? "selected" : ""}`} onClick={() => setSelectedEar("Left")}>
            <img src={leftEarImg} alt="Left Ear" />
            <p>Left Ear</p>
          </div>
          <div className={`ear-option ${selectedEar === "Right" ? "selected" : ""}`} onClick={() => setSelectedEar("Right")}>
            <img src={rightEarImg} alt="Right Ear" />
            <p>Right Ear</p>
          </div>
          <div className={`ear-option ${selectedEar === "Both" ? "selected" : ""}`} onClick={() => setSelectedEar("Both")}>
            <img src={bothEarsImg} alt="Both Ears" />
            <p>Both Ears</p>
          </div>
        </div>

        <div className="status">
          <p>{headphonesConnected ? "✅ Headphones Connected" : "❌ Please connect headphones"}</p>
          <p>{isQuiet ? "✅ Quiet Environment Detected" : `❌ Noise Level: ${Math.round(ambientNoise)}`}</p>
        </div>

        <button
          className="take-test-btn"
          disabled={!isTestEnabled}
          onClick={handleTakeTest}
        >
          Take Test
        </button>
      </div>
    </div>
  );
};

export default EarSelection;
