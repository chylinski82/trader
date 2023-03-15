// utils/deribitAPI.js

const DERIBIT_API = 'https://test.deribit.com/api/v2/public';

export const getHistoricalVolatility = async (currency) => {
  try {
    const response = await fetch(DERIBIT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 8387,
        method: 'public/get_historical_volatility',
        params: {
          currency,
        },
      }),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching historical volatility data:', error);
    return [];
  }
};
