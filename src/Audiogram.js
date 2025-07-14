import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import html2canvas from "html2canvas";

Chart.register(...registerables);

const Audiometry = () => {
  const [leftEarData, setLeftEarData] = useState([]);
  const [rightEarData, setRightEarData] = useState([]);
  const frequencies = [250, 500, 1000, 2000, 4000, 8000];

  useEffect(() => {
    // Fetch stored data from localStorage
    const storedLeftEar = JSON.parse(localStorage.getItem("leftEarData")) || [];
    const storedRightEar = JSON.parse(localStorage.getItem("rightEarData")) || [];

    setLeftEarData(storedLeftEar);
    setRightEarData(storedRightEar);
  }, []);

  const downloadGraph = () => {
    const chartElement = document.getElementById("audiogram-chart");
    html2canvas(chartElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "audiogram.png";
      link.click();
    });
  };

  const data = useMemo(() => {
    return {
      labels: frequencies,
      datasets: [
        ...(leftEarData.length > 0
          ? [{
              label: "Left Ear",
              data: frequencies.map(freq =>
                leftEarData.find(point => point.frequency === freq)?.threshold ?? null
              ),
              borderColor: "blue",
              backgroundColor: "blue",
              pointStyle: "circle",
              pointRadius: 6,
              fill: false,
              tension: 0.1,
            }]
          : []),
        ...(rightEarData.length > 0
          ? [{
              label: "Right Ear",
              data: frequencies.map(freq =>
                rightEarData.find(point => point.frequency === freq)?.threshold ?? null
              ),
              borderColor: "red",
              backgroundColor: "red",
              pointStyle: "cross",
              pointRadius: 6,
              fill: false,
              tension: 0.1,
            }]
          : []),
      ],
    };
  }, [leftEarData, rightEarData]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false, // Disable aspect ratio maintenance
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `${context.dataset.label}: ${value ? value + ' dB HL' : 'No Data'}`;
            },
          },
        },
      },
      scales: {
        y: {
          reverse: true,
          title: {
            display: true,
            text: "Hearing Threshold (dB HL)",
          },
          suggestedMin: -10,
          suggestedMax: 110,
          ticks: {
            stepSize: 10,
          },
        },
        x: {
          title: {
            display: true,
            text: "Frequency (Hz)",
          },
        },
      },
    };
  }, [leftEarData, rightEarData]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{marginTop:"80px"}}>Audiogram</h2>
      <div
        id="audiogram-chart"
        style={{
          backgroundColor: "white",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          alignContent:"center",
          width: "70%",
          height: "400px", // Set a height
          marginLeft:"190px"
        }}
      >
        <Line data={data} options={options} />
      </div>
      <button
        onClick={downloadGraph}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          marginTop: "20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Audiogram
      </button>
      {leftEarData.length > 0 && rightEarData.length > 0 && (
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color:
              Math.max(...leftEarData.map((d) => d.threshold)) <= 20 &&
              Math.max(...rightEarData.map((d) => d.threshold)) <= 20
                ? "green"
                : "orange",
          }}
        >
          {Math.max(...leftEarData.map((d) => d.threshold)) <= 20 &&
          Math.max(...rightEarData.map((d) => d.threshold)) <= 20
            ? "✅ Hearing is within normal range."
            : "⚠️ Hearing loss detected. Please consult a doctor."}
        </p>
      )}
    </div>
  );
};

export default Audiometry;
