import { useState, useEffect } from 'react';

const client_id = 'xxxxxxxxxxx';
const client_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const instrument = 'BTC-PERPETUAL';
const timeframe = '1';

const useHistoricData = () => {
  const [data, setData] = useState([]);

  // Function to fetch data using WebSocket
  const fetchData = () => {
    // Create a new WebSocket instance
    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');

    // Send the message when the WebSocket connection is opened
    ws.onopen = () => {
      console.log('WebSocket UseHistoricData connection established');

      // Create the message to send to the WebSocket server
      const msg = JSON.stringify({
        jsonrpc: '2.0',
        id: 833,
        method: 'public/get_tradingview_chart_data',
        params: {
          instrument_name: instrument,
          start_timestamp: Math.floor(Date.now() - 5 * 60 * 1000),
          end_timestamp: Math.floor(Date.now()),
          resolution: timeframe,
          client_id,
          client_secret,
        },
      });

      // Send the message to the WebSocket server
      ws.send(msg);
    };

    // Update the data state when a message is received from the WebSocket server
    ws.onmessage = (event) => {
      const jsonResp = JSON.parse(event.data);
      const df = jsonToDataFrame(jsonResp);
      console.log('data: ', df)
      setData(df);
    };

    // Log any errors that occur in the WebSocket connection
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Log a message when the WebSocket connection is closed
    ws.onclose = () => {
      console.log('WebSocket UseHistoricData connection closed');
    };

    // Return the WebSocket instance
    return ws;
  };

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

  // Use the useEffect hook to fetch data on component mount
  useEffect(() => {
    const ws = fetchData();

    // Return a function to close the WebSocket connection when the component is unmounted
    return () => {
      ws.close();
    };
  }, []);

  return data;
};

export default useHistoricData;
