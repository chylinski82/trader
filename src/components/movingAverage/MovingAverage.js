import React, { useState, useEffect } from 'react';
import { getHistoricalVolatility } from '../../utils/deribitAPI';

const calculateMovingAverage = (data, periods) => {
  const result = [];
  for (let i = periods; i < data.length; i++) {
    const average = data.slice(i - periods, i).reduce((sum, value) => sum + value, 0) / periods;
    result.push(average);
  }
  return result;
};

const MovingAverage = ({ currency = 'BTC', periods = 5 }) => {
  const [movingAverage, setMovingAverage] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const historicalData = await getHistoricalVolatility(currency);
      const calculatedMovingAverage = calculateMovingAverage(historicalData, periods);
      setMovingAverage(calculatedMovingAverage);
    };

    fetchHistoricalData();
  }, [currency, periods]);

  return (
    <div>
      <h3>Moving Average ({periods} periods):</h3>
      <ul>
        {movingAverage.map((value, index) => (
          <li key={index}>{value.toFixed(3)}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovingAverage;
