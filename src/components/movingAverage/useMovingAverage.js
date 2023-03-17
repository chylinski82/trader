import { useState, useEffect } from 'react';
import useHistoricData from '../historicData/useHistoricData';

const useMovingAverage = () => {
    const [movingAverage, setMovingAverage] = useState(0);
    const historicData = useHistoricData();
  
    useEffect(() => {
      if (historicData.length > 5) {
        // Get the last 5 data sets (not counting the very last one)
        const dataSubset = historicData.slice(-6, -1);
        // Calculate the sum of the closing prices
        const sum = dataSubset.reduce((acc, data) => acc + data.close, 0);
        // Calculate the moving average
        const average = sum / dataSubset.length;
        setMovingAverage(average);
      }
    }, [historicData]);
  
    return movingAverage;
  };

export default useMovingAverage;