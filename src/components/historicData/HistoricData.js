import React from 'react';
import useHistoricData from './useHistoricData';

const HistoricData = () => {
  const data = useHistoricData();

  // Render the fetched data
  return (
    <div>
      <h1>Historic Data</h1>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}</td>
              <td>{item.open}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.close}</td>
              <td>{item.volume.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricData;
