import { useState, useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const client_id = "iqFAdu09";
const client_secret = "NPBJjm3PbksJ9haoASj_6E-c_9Wyi1D-ei5OQFhkmPM";

const useDeribitAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const authMessage = JSON.stringify({
      jsonrpc: '2.0',
      id: 9929,
      method: 'public/auth',
      params: {
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret,
      },
    });

    const ws = new ReconnectingWebSocket('wss://www.deribit.com/ws/api/v2');

    ws.onopen = () => {
      ws.send(authMessage);
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.error) {
        console.error('Auth failed with error:', response.error);
      } else {
        setAccessToken(response.result.access_token);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return accessToken;
};

export default useDeribitAuth;
