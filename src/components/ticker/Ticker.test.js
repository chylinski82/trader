import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import Ticker from './Ticker';
import { WebSocket as MockWebSocket, Server } from 'mock-socket';

// Mock WebSocket
global.WebSocket = MockWebSocket;

describe('Ticker component', () => {
  let mockServer;

  beforeEach(() => {
    mockServer = new Server('wss://test.deribit.com/ws/api/v2');
  });

  afterEach(() => {
    mockServer.close();
  });

  const sendInitialMessage = () => {
    mockServer.on('connection', (socket) => {
      socket.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.id === 8106) {
          socket.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 8106,
            result: {
              last_price: 10000,
            },
          }));
          setTimeout(() => {
            socket.send(JSON.stringify({
              jsonrpc: '2.0',
              id: 8106,
              result: {
                last_price: 11000,
              },
            }));
          }, 1000);
        }
      });
    });
  };

  it('should render initial price correctly', async () => {
    sendInitialMessage();

    const setPrice = jest.fn();
    render(<Ticker price={0} setPrice={setPrice} />);

    await waitFor(() => {
      expect(screen.getByText('Last Price: 0')).toBeInTheDocument();
    });
  });

  it('should update price when receiving new data from WebSocket', async () => {
    sendInitialMessage();
  
    const setPrice = jest.fn();
    render(<Ticker price={0} setPrice={setPrice} />);
  
    await waitFor(() => {
      expect(setPrice).toHaveBeenCalledWith(10000);
    });
  
    await waitFor(() => {
      expect(setPrice).toHaveBeenCalledWith(11000);
    }, { timeout: 2000 });
  });  

  it('should attempt to reopen WebSocket connection when closed', async () => {
    sendInitialMessage();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const setPrice = jest.fn();
    render(<Ticker price={0} setPrice={setPrice} />);

    await act(async () => {
      mockServer.close();
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('WebSocket connection closed');
    expect(consoleLogSpy).toHaveBeenCalledWith(`Reopening WebSocket in ${1000} ms`);
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should display a warning if fetched incorrect value', async () => {
    sendInitialMessage();
  
    const setPrice = jest.fn();
    const { rerender } = render(<Ticker price={0} setPrice={setPrice} />);
  
    await act(async () => {
      mockServer.clients().forEach((socket) => {
        socket.send(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 8106,
            result: {
              last_price: 10000.56, // Send an incorrect value
            },
          })
        );
      });
    });
  
    await waitFor(() => {
      expect(setPrice).toHaveBeenCalledWith(10000.56);
    });
  
    rerender(<Ticker price={10000.56} setPrice={setPrice} />);
  
    expect(screen.getByText(/Warning: Fetched incorrect value/i)).toBeInTheDocument();
  });   
});
