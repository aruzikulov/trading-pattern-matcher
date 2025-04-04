import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

const root = createRoot(document.getElementById('root')); // Create a root
root.render(<App />); // Render the app

// Register the required components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);