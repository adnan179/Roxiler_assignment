import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "./Loading";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, month }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Loading />;
  }

  const labels = Object.keys(data);
  const values = labels.map((label) => data[label]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of items",
        data: values,
        backgroundColor: "rgba(255, 94, 14,0.6)",
        borderColor: "rgba(255, 94, 14,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold text-white pb-10">
        Bar Chart - {month}
      </h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
