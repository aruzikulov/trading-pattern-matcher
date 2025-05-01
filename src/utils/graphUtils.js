// Preprocess the API response into a usable format
export const preprocessData = (data, timeframe) => {
  const timeSeries = data['Monthly Time Series'] || data['Time Series (Daily)'];
  if (!timeSeries) {
    throw new Error('Invalid API response: Missing Time Series data');
  }

  const dates = Object.keys(timeSeries)
    .sort((a, b) => new Date(a) - new Date(b)); // Sort dates ascending (oldest to newest)
  const selectedDates = dates.slice(-timeframe); // Take the last N dates (most recent N in ascending order)

  return selectedDates.map(date => ({
    date,
    open: parseFloat(timeSeries[date]['1. open']),
    high: parseFloat(timeSeries[date]['2. high']),
    low: parseFloat(timeSeries[date]['3. low']),
    close: parseFloat(timeSeries[date]['4. close']),
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

// Get the steps after the similar graph
export const getStepsAfterGraph = (historicalData, similarGraph, timeframe) => {
  const startIndex = historicalData.findIndex(
    (data) => data.date === similarGraph[similarGraph.length - 1].date
  );

  if (startIndex === -1 || startIndex + timeframe >= historicalData.length) {
    return [];
  }

  return historicalData.slice(startIndex + 1, startIndex + 1 + timeframe);
};