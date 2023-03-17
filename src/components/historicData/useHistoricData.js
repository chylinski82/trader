import { useState, useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import useDeribitAuth from '../../useDeribitAuth';

const useHistoricData = () => {
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
  const fetchData = (accessToken) => {
    // Calculate the end and start timestamps for the data
    const end = Math.floor(Date.now());
    const start = Math.floor(Date.now() - 5 * 60 * 1000);
  
    // Create the message to send to the WebSocket server
    const msg = JSON.stringify({
        jsonrpc: '2.0',
        id: 833,
        method: 'public/get_tradingview_chart_data',
        params: {
          instrument_name: instrument,
          start_timestamp: start,
          end_timestamp: end,
          resolution: timeframe,
          access_token: accessToken,
        },
      });
  
    // Create a new WebSocket instance
    const ws = new ReconnectingWebSocket('wss://www.deribit.com/ws/api/v2');
  
    // Send the message when the WebSocket connection is opened
    ws.onopen = () => {
      ws.send(msg);
    };
  
    // Update the data state when a message is received from the WebSocket server
    ws.onmessage = (event) => {
      const jsonResp = JSON.parse(event.data);
      const df = jsonToDataFrame(jsonResp);
      setData(df);
    };
  
    // Log any errors that occur in the WebSocket connection
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    // Attempt to reconnect to the WebSocket server if the connection is closed
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(() => {
        console.log('Reconnecting WebSocket');
        fetchData();
      }, 5000); // wait 5 seconds before attempting to reconnect
    };
  
    // Return a function to close the WebSocket connection when the component is unmounted
    return () => {
      ws.close();
    };
  };
  
  // Function to calculate the delay to fetch data at the close of a minute
  const calculateDelay = () => {
    const now = new Date();
    const secondsToNextMinute = 60 - now.getUTCSeconds();
    const millisecondsToNextMinute = 1000 - now.getUTCMilliseconds();
    const delay = (secondsToNextMinute * 1000) + millisecondsToNextMinute;
    return delay;
  };

  const accessToken = useDeribitAuth();
  
  // Function to fetch data and schedule the next fetch at the close of a minute 
  
  const fetchDataAndScheduleNext = () => {
    if (accessToken) {
      fetchData(accessToken);
    }
    const delay = calculateDelay();
    setTimeout(fetchDataAndScheduleNext, delay);
  };
  
  // Use the useEffect hook to fetch data on component mount and at the close of a minute 
  useEffect(() => {
    if (accessToken) {
      fetchDataAndScheduleNext();
    }
  }, [accessToken]);
  
  return data;
};

export default useHistoricData;
