import React, { useState, useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const HistoricData = () => {
  const [data, setData] = useState([]);

  const instrument = 'BTC-PERPETUAL';
  const timeframe = '1';

  // Function to convert JSON response to a DataFrame (object array)
  const jsonToDataFrame = (jsonResp) => {
    const res = jsonResp.result;

    // Map the ticks data to DataFrame object with required fields
    const df = res.ticks.map((tick, index) => {
      const timestamp = new Date(tick);
      return {
        timestamp,
        open: res.open[index],
        high: res.high[index],
        low: res.low[index],
        close: res.close[index],
        volume: res.volume[index],
      };
    });

    return df;
  };

  // Function to fetch data using WebSocket
  const fetchData = () => {
    const end = Math.floor(Date.now());
    const start = Math.floor(Date.now() - 5 * 60 * 1000);

    const msg = JSON.stringify({
      jsonrpc: '2.0',
      id: 833,
      method: 'public/get_tradingview_chart_data',
      params: {
        instrument_name: instrument,
        start_timestamp: start,
        end_timestamp: end,
        resolution: timeframe,
      },
    });

    // Create WebSocket instance
    const ws = new ReconnectingWebSocket('wss://test.deribit.com/ws/api/v2');

    // Send message when WebSocket connection opens
    ws.onopen = () => {
      ws.send(msg);
    };

    // Update data state when message is received
    ws.onmessage = (event) => {
      const jsonResp = JSON.parse(event.data);
      const df = jsonToDataFrame(jsonResp);
      setData(df);
    };

    // Log any errors in WebSocket connection
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Close WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  };

  // Use useEffect to fetch data on component mount and at regular intervals
  useEffect(() => {
    fetchData();

    // Calculate the delay until the next minute and set the interval for the fetch
    const millisecondsUntilNextMinute = 60 * 1000 - (Date.now() % (60 * 1000));
    const fetchInterval = 60 * 1000;

    // Call the fetchData function initially and then at every fetch interval
    const initialTimeout = setTimeout(() => {
      fetchData();
      const intervalId = setInterval(fetchData, fetchInterval);
      return () => clearInterval(intervalId);
    }, millisecondsUntilNextMinute);

    // Clear the initial timeout when the component unmounts
    return () => clearTimeout(initialTimeout);
  }, []);

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
