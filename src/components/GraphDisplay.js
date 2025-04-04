import React from 'react';
import { Line } from 'react-chartjs-2';

const GraphDisplay = ({ graph, title }) => {
  const chartData = {
    labels: graph.map(point => point.date),
    datasets: [
      {
        label: 'Price',
        data: graph.map(point => point.close),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>{title}</h2>
      <Line data={chartData} />
    </div>
  );
};

export default GraphDisplay;