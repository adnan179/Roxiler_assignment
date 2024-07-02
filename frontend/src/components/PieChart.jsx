import React from "react";
import { PieChart } from "@mui/x-charts";

const PieChartComponent = ({ data, month }) => {
  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available for pie chart.</div>;
  }

  // Format data for the pie chart
  const formattedData = data.map((item) => ({
    label: item.category,
    value: item.itemCount,
  }));

  return (
    <div className="flex flex-col gap-7 w-full h-[400px]">
      <h1 className="text-2xl font-bold text-white">Pie Chart - {month}</h1>
      <PieChart
        series={[
          {
            data: formattedData,
          },
        ]}
        sx={{
          fill: "white",
          fontWeight: "bold",
        }}
      />
    </div>
  );
};

export default PieChartComponent;
