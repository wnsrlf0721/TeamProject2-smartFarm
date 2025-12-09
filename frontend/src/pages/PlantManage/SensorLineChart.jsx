import { Chart } from "react-google-charts";

function SensorLineChart({ title, data }) {
  const chartData = [["시간", title], ...data.map(([time, value]) => [time, Number(value)])];

  const options = {
    curveType: "function",
    legend: "none",

    // 라임 선 색
    colors: ["#b7d957"],

    // 라임 영역 fill
    series: {
      0: {
        lineWidth: 4,
        areaOpacity: 0.2,
        color: "#b7d957",
      },
    },

    hAxis: {
      textStyle: { color: "#6e7f5f", fontSize: 12 },
      gridlines: { color: "#eef6d6" },
    },
    vAxis: {
      textStyle: { color: "#6e7f5f", fontSize: 12 },
      gridlines: { color: "#eef6d6" },
    },

    chartArea: {
      left: 40,
      top: 20,
      width: "85%",
      height: "70%",
    },

    backgroundColor: "transparent",
  };

  return (
    <div className="chart-widget">
      <div className="chart-widget-header">
        <h3>{title}</h3>
      </div>
      <Chart chartType="LineChart" width="100%" height="240px" data={chartData} options={options} />
    </div>
  );
}

export default SensorLineChart;
