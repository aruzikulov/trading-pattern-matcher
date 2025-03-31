import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import axios from 'axios';

const PatternMatcher = () => {
  const [currentData, setCurrentData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [similarPatterns, setSimilarPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1d');
  const [symbol, setSymbol] = useState('BTC-USD');

  // Fetch current price data
  useEffect(() => {
    const fetchCurrentData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=30&interval=daily`
        );
        const prices = response.data.prices.map(item => item[1]);
        setCurrentData(prices.slice(-30)); // Last 30 days
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchCurrentData();
  }, [symbol, timeframe]);

  // Fetch historical data for comparison
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch more comprehensive historical data
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=365&interval=daily`
        );
        const prices = response.data.prices.map(item => item[1]);
        setHistoricalData(prices);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
      setIsLoading(false);
    };

    fetchHistoricalData();
  }, [symbol]);

  // Find similar patterns
  const findSimilarPatterns = async () => {
    if (!currentData.length || !historicalData.length) return;

    setIsLoading(true);
    
    try {
      // Normalize data
      const normalize = (data) => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        return data.map(val => (val - min) / (max - min));
      };

      const currentNormalized = normalize(currentData);
      
      // Prepare model (using Universal Sentence Encoder as a similarity model)
      const model = await use.load();
      const embeddings = await model.embed([currentNormalized.join(' ')]);

      // Compare with historical patterns (simplified for demo)
      const windowSize = currentData.length;
      const similarities = [];
      
      for (let i = 0; i <= historicalData.length - windowSize; i++) {
        const window = historicalData.slice(i, i + windowSize);
        const windowNormalized = normalize(window);
        
        const windowEmbedding = await model.embed([windowNormalized.join(' ')]);
        const similarity = tf.matMul(embeddings, windowEmbedding, false, true).dataSync()[0];
        
        similarities.push({
          startIndex: i,
          endIndex: i + windowSize,
          similarity,
          data: window
        });
      }

      // Sort by similarity and take top 5
      const sorted = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
      setSimilarPatterns(sorted);
    } catch (error) {
      console.error('Error finding similar patterns:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="pattern-matcher">
      <h1>Trading Pattern Matcher</h1>
      
      <div className="controls">
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="BTC-USD">Bitcoin</option>
          <option value="ETH-USD">Ethereum</option>
          <option value="AAPL">Apple</option>
          <option value="MSFT">Microsoft</option>
        </select>
        
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="1d">Daily</option>
          <option value="1h">Hourly</option>
          <option value="1w">Weekly</option>
        </select>
        
        <button onClick={findSimilarPatterns} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Find Similar Patterns'}
        </button>
      </div>
      
      <div className="chart-container">
        <h2>Current Price Pattern ({timeframe})</h2>
        <Chart
          type="line"
          data={{
            labels: currentData.map((_, i) => i),
            datasets: [{
              label: 'Price',
              data: currentData,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          }}
        />
      </div>
      
      {similarPatterns.length > 0 && (
        <div className="similar-patterns">
          <h2>Similar Historical Patterns</h2>
          <div className="patterns-grid">
            {similarPatterns.map((pattern, idx) => (
              <div key={idx} className="pattern">
                <h3>Match #{idx + 1} (Similarity: {pattern.similarity.toFixed(2)})</h3>
                <Chart
                  type="line"
                  data={{
                    labels: pattern.data.map((_, i) => i),
                    datasets: [{
                      label: 'Price',
                      data: pattern.data,
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1
                    }]
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternMatcher;