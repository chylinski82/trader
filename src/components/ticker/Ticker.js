import React, { useEffect } from 'react';

function Ticker({ price, setPrice}) {

  // Set the interval (in ms) for fetching price data
  const PRICE_FETCH_INTERVAL = 1000;

  useEffect(() => {
    let socket = null;

    // Function to open the WebSocket connection and send message to fetch price data
    const openWebSocket = () => {
      socket = new WebSocket('wss://www.deribit.com/ws/api/v2');
     
      socket.onopen = () => {
        console.log('WebSocket Ticker connection established');
        const msg = JSON.stringify({
          jsonrpc: '2.0',
          id: 8106,
          method: 'private/ticker',
          params: {
            instrument_name: 'BTC-PERPETUAL',
            client_id:'iqFAdu09',
            client_secret: 'NPBJjm3PbksJ9haoASj_6E-c_9Wyi1D-ei5OQFhkmPM'
          },
        });
        socket.send(msg);
      };

      // Update the state with the fetched price data
      socket.onmessage = (event) => {
        const json_par = JSON.parse(event.data);
        //console.log(json_par);
        setPrice(json_par.result.last_price); // set the state with the price data
      };

      // Log any errors in WebSocket connection and reopen the connection after a delay
      socket.onerror = (event) => {
        console.error('WebSocket error', event);
        reopenWebSocket();
      };

      // Log when the WebSocket connection is closed and clear the interval
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        clearInterval(intervalId); // clear the interval when the WebSocket connection is closed
        reopenWebSocket();
      };
    };

    // Function to reopen WebSocket connection after a delay
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

    // Clean up function to close WebSocket connection when the component is unmounted
    return () => {
      if (socket) {
        console.log('Closing WebSocket connection');
        socket.close(); // close the WebSocket connection when the component is unmounted
      }
    };
  }, []);

  // Function to check if the fetched price data is valid
  const isValidPrice = (price) => {
    const decimalPlaces = (price.toString().split('.')[1] || []).length;
    return decimalPlaces <= 1;
  };

  // Render the price data or a loading message or an error message if the data is invalid
  return (
    <div>
      {price !== null ? (
        isValidPrice(price) ? (
          <div className='field'>Price: {price}</div>
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