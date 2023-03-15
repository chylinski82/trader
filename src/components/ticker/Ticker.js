import React, { useEffect } from 'react';

function Ticker({ price, setPrice}) {
  
  const PRICE_FETCH_INTERVAL = 1000;

  useEffect(() => {
    let socket = null;

    const openWebSocket = () => {
      socket = new WebSocket('wss://test.deribit.com/ws/api/v2');
     
      socket.onopen = () => {
        console.log('WebSocket connection established');
        const msg = JSON.stringify({
          jsonrpc: '2.0',
          id: 8106,
          method: 'public/ticker',
          params: {
            instrument_name: 'BTC-PERPETUAL',
          },
        });
        socket.send(msg);
      };

      socket.onmessage = (event) => {
        const json_par = JSON.parse(event.data);
        console.log(json_par);
        setPrice(json_par.result.last_price); // set the state with the price data
      };

      socket.onerror = (event) => {
        console.error('WebSocket error', event);
        reopenWebSocket();
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        clearInterval(intervalId); // clear the interval when the WebSocket connection is closed
        reopenWebSocket();
      };
    };

    const reopenWebSocket = () => {
      console.log(`Reopening WebSocket in ${PRICE_FETCH_INTERVAL} ms`);
      setTimeout(openWebSocket, PRICE_FETCH_INTERVAL);
    };

    openWebSocket();

    // Set up an interval to send the message periodically
    const intervalId = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const msg = JSON.stringify({
          jsonrpc: '2.0',
          id: 8106,
          method: 'public/ticker',
          params: {
            instrument_name: 'BTC-PERPETUAL',
          },
        });
        socket.send(msg);
      }
    }, PRICE_FETCH_INTERVAL);

    return () => {
      if (socket) {
        console.log('Closing WebSocket connection');
        socket.close(); // close the WebSocket connection when the component is unmounted
      }
    };
  }, []);

  const isValidPrice = (price) => {
    const decimalPlaces = (price.toString().split('.')[1] || []).length;
    return decimalPlaces <= 1;
  };

  return (
    <div>
      {price !== null ? (
        isValidPrice(price) ? (
          <div>Last Price: {price}</div>
        ) : (
          <div className="warning">Warning: Fetched incorrect value</div>
        )
      ) : (
        <div>Loading price...</div>
      )}
    </div>
  );
}

export default Ticker;