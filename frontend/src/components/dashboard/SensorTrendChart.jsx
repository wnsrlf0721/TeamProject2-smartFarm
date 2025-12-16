// src/components/dashboard/SensorTrendChart.jsx

import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./SensorTrendChart.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

// 평균, 최대, 최소 계산 함수
function calculateStats(data = []) {
  if (!data.length) return { avg: "-", max: "-", min: "-" };

  const values = data.map((d) => d.value).filter((v) => typeof v === "number");

  if (!values.length) return { avg: "-", max: "-", min: "-" };
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return { avg, max, min };
}

export default function SensorTrendChart({ title, data = [], unit = "" }) {
  console.log("chart data sample", data[0]);
  const stats = calculateStats(data);

  // 데이터 없으면 빈 박스
  if (!data || data.length === 0) {
    return (
      <div className="trend-card">
        <div className="trend-header">
          <h3>{title}</h3>
        </div>
        <div className="no-data">데이터 없음</div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => (typeof d.time === "string" ? d.time : "-")), // 시간(HH:MM)만 표시
    datasets: [
      {
        label: title,
        data: data.map((d) => (typeof d.value === "number" ? d.value : null)),
        fill: true,
        tension: 0.35,
        borderColor: "rgba(90, 140, 90, 0.9)",
        backgroundColor: "rgba(120, 180, 120, 0.15)",
        pointBackgroundColor: "rgba(90, 130, 90, 1)",
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6d7b6d", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(150,150,150,0.1)" },
        ticks: { color: "#6d7b6d", font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#333",
        bodyColor: "#2c3a28",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="trend-card">
      <div className="trend-header">
        <h3>{title}</h3>

        {/* 평균/최대/최소 표시 */}
        <div className="trend-stats">
          <span>
            평균: {stats.avg}
            {unit}
          </span>
          <span>
            최대: {stats.max}
            {unit}
          </span>
          <span>
            최소: {stats.min}
            {unit}
          </span>
        </div>
      </div>

      <div className="trend-chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
