import { useState, useEffect } from 'react';

const client_id = '7UxnGRik';
const client_secret = 'el5jTF5RDDAYSiCJ5IjJB539BnmqhbMFdqd8sS0f6PA';
const instrument = 'BTC-PERPETUAL';
const timeframe = '1';

const useHistoricData = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');

    ws.onopen = () => {
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

      ws.send(msg);
    };

    ws.onmessage = (event) => {
      const jsonResp = JSON.parse(event.data);
      const df = jsonToDataFrame(jsonResp);
      setData(df);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(() => {
        console.log('Reconnecting WebSocket');
        fetchData();
      }, 10000); // wait before attempting to reconnect
    };

    return ws;
  };

  const jsonToDataFrame = (jsonResp) => {
    const res = jsonResp.result;

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

  useEffect(() => {
    const ws = fetchData();

    return () => {
      ws.close();
    };
  }, []);

  return data;
};

export default useHistoricData;
