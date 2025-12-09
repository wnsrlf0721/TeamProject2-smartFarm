// src/pages/PlantManage/GaugeChart.jsx
import { Chart } from "react-google-charts";

function GaugeChart({ label, value }) {
  const data = [
    ["Label", "Value"],
    [label, value],
  ];

  const options = {
    width: 200,
    height: 160,
    redFrom: 0,
    redTo: 20,
    yellowFrom: 20,
    yellowTo: 60,
    greenFrom: 60,
    greenTo: 100,
    minorTicks: 5,
  };

  return <Chart chartType="Gauge" data={data} options={options} />;
}

export default GaugeChart;
