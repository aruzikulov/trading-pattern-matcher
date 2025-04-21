import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { TimeScale, LinearScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './GraphDisplay.css';

// Register financial chart components
Chart.register(CandlestickController, CandlestickElement, TimeScale, LinearScale, Tooltip, Legend);

const GraphDisplay = ({ graph, title }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (!graph || graph.length === 0) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: 'Candlestick Data',
            data: graph.map(point => ({
              x: new Date(point.date), // Convert date string to Date object
              o: point.open,
              h: point.high,
              l: point.low,
              c: point.close,
            })),
            borderColor: '#333',
            borderWidth: 1,
            color: {
              up: '#26a69a',
              down: '#ef5350',
              unchanged: '#333',
            },
            barThickness: 8, // Set candle width to a narrower value
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'month' }, // Use 'month' for monthly data
            title: { display: true, text: 'Date' },
          },
          y: {
            title: { display: true, text: 'Price' },
          },
        },
      },
    });
    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [graph]);

  return (
    <div className="graph-container">
      <h2>{title}</h2>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GraphDisplay;