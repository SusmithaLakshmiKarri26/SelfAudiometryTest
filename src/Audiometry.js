import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const frequencies = [250, 500, 1000, 2000, 4000, 8000];

const AudiometryTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedEar = location.state?.selectedEar;

  const [currentFreqIndex, setCurrentFreqIndex] = useState(0);
  const [thresholds, setThresholds] = useState([]);

  useEffect(() => {
    playTone(frequencies[currentFreqIndex]);
  }, [currentFreqIndex]);

  const playTone = (freq) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 2000);
  };

  const handleResponse = (heard) => {
    setThresholds([...thresholds, { frequency: frequencies[currentFreqIndex], threshold: heard ? 10 : 30 }]);

    if (currentFreqIndex < frequencies.length - 1) {
      setCurrentFreqIndex(currentFreqIndex + 1);
    } else {
      // Store the results and navigate to Audiometry.js
      if (selectedEar === "Left") {
        localStorage.setItem("leftEarData", JSON.stringify(thresholds));
      } else {
        localStorage.setItem("rightEarData", JSON.stringify(thresholds));
      }

      navigate("/audiometry");
    }
  };

  return (
    <div>
      <h2>Testing {selectedEar} Ear</h2>
      <p>Frequency: {frequencies[currentFreqIndex]} Hz</p>
      <p>Do you hear the sound?</p>
      <button onClick={() => handleResponse(true)}>Yes</button>
      <button onClick={() => handleResponse(false)}>No</button>
    </div>
  );
};

export default AudiometryTest;
