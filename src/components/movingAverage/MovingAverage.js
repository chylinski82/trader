import { useState, useEffect, useRef } from 'react';
import useHistoricData from '../historicData/useHistoricData';

const MovingAverage = ({ price, movingAverage, setMovingAverage }) => {
  const [maData, setMaData] = useState([]); // State variable to store the moving average data
  const historicData = useHistoricData(); // Custom hook to fetch historical data
  const lastUpdateRef = useRef(null); // Ref to track the last update minute of the moving average data

  useEffect(() => {
    // Calculate moving average data subset when historical data updates
    if (historicData.length > 5) {
      const dataSubset = historicData.slice(-6, -1); // Get the last 5 data points
      setMaData(dataSubset.map(data => data.close)); // Extract the close prices and update state
    }
  }, [historicData]);

  useEffect(() => {
    // Calculate moving average when the moving average data updates
    const calculateMovingAverage = () => {
      if (maData.length === 5) { // Check if there are 5 data points to calculate moving average
        const sum = maData.reduce((acc, value) => acc + value, 0); // Calculate the sum of data points
        const average = sum / maData.length; // Calculate the moving average
        setMovingAverage(average); // Update the moving average state
      }
    };

    calculateMovingAverage();
  }, [maData, setMovingAverage]);

  const updateMaData = () => {
    if (price !== null && price !== undefined) {
      setMaData(prevMaData => [...prevMaData.slice(1), price]); // Add the latest price to the moving average data
    }
  };

  useEffect(() => {
    if (price === null || price === undefined) { // Skip if the price is null or undefined
      return;
    }

    const now = new Date();
    const currentMinute = now.getMinutes(); // Get the current minute of the hour

    if (lastUpdateRef.current === null || lastUpdateRef.current !== currentMinute) {
      updateMaData(); // Add the latest price to the moving average data if a new minute starts
      lastUpdateRef.current = currentMinute; // Update the last update minute ref
    }
    console.log(maData); // Log the moving average data for debugging purposes
  }, [price]);

  return <div className="field">MA: {movingAverage.toFixed(1)}</div>; // Render the moving average with one decimal place
};

export default MovingAverage;
