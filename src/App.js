import React, { useState } from 'react';
import GalaxyBackground from './components/GalaxyBackground';
import { fetchHistoricalData } from './utils/api';
import { preprocessData, findSimilarGraph } from './utils/graphUtils';
import GraphDisplay from './components/GraphDisplay';
import './App.css';

const App = () => {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState(7);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [similarGraph, setSimilarGraph] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const PASSWORD = 'murod777'; // Change this to your desired password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

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

  if (!isAuthenticated) {
    return (
      <>
        <GalaxyBackground />
        <div className="login-overlay">
          <form onSubmit={handleLogin} className="login-form">
          <h2>Murod Trader</h2>
            <h2>Parolni kiriting</h2>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Parol"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <GalaxyBackground />
      <div className="App">
        <div className="app-content">
          <h1>Murod Trader Graph Comparison</h1>
          <input
            type="text"
            placeholder="stock nomini yozing"
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
      </div>
    </>
  );
};

export default App;