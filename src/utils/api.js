import axios from 'axios';

const API_KEY = 'BR3XV5IWIOORKBUP'; // Replace with your actual API key

export const fetchHistoricalData = async (symbol, interval = 'MONTHLY') => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_${interval}&symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};



