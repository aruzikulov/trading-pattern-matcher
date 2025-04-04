import React, { useState } from 'react';
import { fetchHistoricalData } from './utils/api';
import { preprocessData, findSimilarGraph } from './utils/graphUtils';
import GraphDisplay from './components/GraphDisplay';

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [similarGraph, setSimilarGraph] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await fetchHistoricalData(symbol);
      if (!data) {
        alert('Failed to fetch data. Please check the stock symbol or API key.');
        return;
      }

      // Preprocess data for the current graph
      const processedData = preprocessData(data, timeframe);

      // Preprocess a larger dataset for historical comparison
      const historicalData = preprocessData(data, 100); // Use a larger dataset

      // Find the most similar graph
      const mostSimilar = findSimilarGraph(processedData, historicalData, timeframe);

      // Update state
      setCurrentGraph(processedData);
      setSimilarGraph(mostSimilar);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Trading Graph Comparison</h1>
      <input
        type="text"
        placeholder="Enter stock symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        type="number"
        placeholder="Timeframe (days)"
        value={timeframe}
        onChange={(e) => setTimeframe(Number(e.target.value))}
      />
      <button onClick={handleSearch}>Search</button>

      {currentGraph && <GraphDisplay graph={currentGraph} title="Current Graph" />}
      {similarGraph && <GraphDisplay graph={similarGraph} title="Most Similar Graph" />}
    </div>
  );
};

export default App;