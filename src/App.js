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
      const data = await fetchHistoricalData(symbol, 'MONTHLY'); // Fetch monthly data for extended history
      if (!data) {
        alert('Failed to fetch data. Please check the stock symbol or API key.');
        return;
      }

      // Preprocess data for the current graph
      const processedData = preprocessData(data, timeframe);

      // Preprocess a larger dataset for historical comparison (e.g., 20 years)
      const historicalData = preprocessData(data, 240); // 20 years of monthly data

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
      <h1>Murod Trader Graph Comparison</h1>
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
      <button onClick={handleSearch}>o'xshashini top</button>

      {currentGraph && <GraphDisplay graph={currentGraph} title="Xozirgi Graph" />}
      {similarGraph && <GraphDisplay graph={similarGraph} title="Eng o'xshash Graph" />}
    </div>
  );
};

export default App;