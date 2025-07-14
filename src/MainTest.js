import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Test.css";

const frequencies = [125, 250, 500, 1000, 2000, 4000, 8000];
const volumes = Array.from({ length: 13 }, (_, i) => i * 10 - 10); // -10 dB to 110 dB

const Test = () => {
  const navigate = useNavigate();
  const [selectedEar, setSelectedEar] = useState(localStorage.getItem("selectedEar") || "Both");
  const initialEar = localStorage.getItem("selectedEar") || "Both";

  const [selectedPointsLeft, setSelectedPointsLeft] = useState({});
  const [selectedPointsRight, setSelectedPointsRight] = useState({});
  const [results, setResults] = useState({ left: [], right: [] });
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (!audioContext) {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }
  }, [audioContext]);

  useEffect(() => {
    const leftEarData = JSON.parse(localStorage.getItem("leftEarData")) || [];
    const rightEarData = JSON.parse(localStorage.getItem("rightEarData")) || [];
    setResults({ left: leftEarData, right: rightEarData });

    const left = {};
    leftEarData.forEach((item) => (left[item.frequency] = item.threshold));
    setSelectedPointsLeft(left);

    const right = {};
    rightEarData.forEach((item) => (right[item.frequency] = item.threshold));
    setSelectedPointsRight(right);
  }, []);

  const playTone = (freq, vol) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const panner = audioContext.createStereoPanner();

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.type = "sine";

    const minGain = 0.0001;
    const maxGain = 1.0;
    const adjustedVolume = Math.pow(10, (vol - 110) / 50);
    gainNode.gain.setValueAtTime(Math.max(minGain, Math.min(adjustedVolume, maxGain)), audioContext.currentTime);

    panner.pan.setValueAtTime(
      selectedEar === "Left" ? -1 : selectedEar === "Right" ? 1 : 0,
      audioContext.currentTime
    );

    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), 1000);
  };

  const handleCheckboxChange = (freq, vol) => {
    playTone(freq, vol);

    const updateEarData = (ear, setter, earResultsKey) => {
      setter((prev) => ({ ...prev, [freq]: vol }));
      setResults((prevResults) => {
        const updated = { ...prevResults };
        updated[earResultsKey] = [
          ...updated[earResultsKey].filter((item) => item.frequency !== freq),
          { frequency: freq, threshold: vol },
        ];
        localStorage.setItem(`${earResultsKey}EarData`, JSON.stringify(updated[earResultsKey]));
        return updated;
      });
    };

    if (selectedEar === "Both") {
      updateEarData("left", setSelectedPointsLeft, "left");
      updateEarData("right", setSelectedPointsRight, "right");
    } else if (selectedEar === "Left") {
      updateEarData("left", setSelectedPointsLeft, "left");
    } else if (selectedEar === "Right") {
      updateEarData("right", setSelectedPointsRight, "right");
    }
  };

  const handleTestOtherEar = () => {
    const newEar = selectedEar === "Left" ? "Right" : "Left";
    setSelectedEar(newEar);
    localStorage.setItem("selectedEar", newEar);

    if (newEar === "Left") {
      setSelectedPointsLeft({});
      localStorage.removeItem("leftEarData");
      setResults((prev) => ({ ...prev, left: [] }));
    } else if (newEar === "Right") {
      setSelectedPointsRight({});
      localStorage.removeItem("rightEarData");
      setResults((prev) => ({ ...prev, right: [] }));
    }
  };

  const isEarTestComplete = (ear) => {
    const points = ear === "left" ? selectedPointsLeft : selectedPointsRight;
    return frequencies.every((freq) => points.hasOwnProperty(freq));
  };

  const isTestComplete = () => {
    if (selectedEar === "Both") {
      return isEarTestComplete("left") && isEarTestComplete("right");
    }
    return isEarTestComplete(selectedEar.toLowerCase());
  };

  return (
    <div className="test-container">
      {/* Instructions */}
      <div className="instructions">
        <h3>Instructions:</h3>
        <ol>
          <li>Test different frequencies (125 Hz to 8000 Hz).</li>
          <li>Increase volume from top to bottom gradually until the tone is heard.</li>
          <li>Select the volume level at which the tone is first heard.</li>
          <li>Repeat for all frequencies.</li>
        </ol>
      </div>

      {/* Test Grid */}
      <div className="grid-container">
        <div className="grid">
          <div className="y-axis-label-placeholder"></div>
          {frequencies.map((freq) => (
            <div key={freq} className="grid-header-item">{freq} Hz</div>
          ))}
        </div>

        {volumes.map((vol) => (
          <div key={vol} className="grid">
            <div className="y-axis-label">{vol} dB</div>
            {frequencies.map((freq) => (
              <div key={freq} className="grid-cell">
                <input
                  type="checkbox"
                  checked={
                    selectedEar === "Left"
                      ? selectedPointsLeft[freq] === vol
                      : selectedEar === "Right"
                      ? selectedPointsRight[freq] === vol
                      : selectedPointsLeft[freq] === vol && selectedPointsRight[freq] === vol
                  }
                  onChange={() => handleCheckboxChange(freq, vol)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="button-container">
        {selectedEar !== "Both" && (
          <button
            className="test-ear-button"
            onClick={handleTestOtherEar}
            disabled={!isTestComplete()}
          >
            {selectedEar === "Left" ? "Test Right Ear" : "Test Left Ear"}
          </button>
        )}

        <button
          className="generate-report-button"
          onClick={() => navigate("/audiogram", { state: { results } })}
          disabled={!isTestComplete()}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Test;
