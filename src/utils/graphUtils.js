// Preprocess the API response into a usable format
export const preprocessData = (data, timeframe) => {
  const timeSeries = data['Monthly Time Series'] || data['Time Series (Daily)'];
  if (!timeSeries) {
    throw new Error('Invalid API response: Missing Time Series data');
  }

  const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a)); // Sort dates descending
  const selectedDates = dates.slice(0, timeframe);

  return selectedDates.map(date => ({
    date,
    close: parseFloat(timeSeries[date]['4. close']), // Ensure numeric values
  }));
};

// Calculate Euclidean distance between two graphs
export const euclideanDistance = (graph1, graph2) => {
  if (graph1.length !== graph2.length) {
    throw new Error('Graphs must have the same length');
  }

  let distance = 0;
  for (let i = 0; i < graph1.length; i++) {
    distance += Math.pow(graph1[i].close - graph2[i].close, 2);
  }
  return Math.sqrt(distance);
};

// Find the most similar graph from historical data
export const findSimilarGraph = (currentGraph, historicalData, timeframe) => {
  let minDistance = Infinity;
  let mostSimilarGraph = null;

  // Start comparison after the current graph's timeframe to avoid overlap
  for (let i = timeframe; i < historicalData.length - timeframe; i++) {
    const historicalGraph = historicalData.slice(i, i + timeframe);
    const distance = euclideanDistance(currentGraph, historicalGraph);

    if (distance < minDistance) {
      minDistance = distance;
      mostSimilarGraph = historicalGraph;
    }
  }

  return mostSimilarGraph;
};