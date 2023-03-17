import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import HistoricData from './HistoricData';
import { WebSocket as MockWebSocket, Server } from 'mock-socket';

// Mock WebSocket
global.WebSocket = MockWebSocket;

describe('HistoricData component', () => {
  let mockServer;

  beforeEach(() => {
    // Create a new Mock WebSocket server before each test
    mockServer = new Server('wss://test.deribit.com/ws/api/v2');
  });

  afterEach(() => {
    // Close the Mock WebSocket server after each test
    mockServer.close();
  });

  // Function to send initial chart data to the Mock WebSocket server
  const sendInitialChartData = () => {
    mockServer.on('connection', (socket) => {
      socket.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.id === 833) {
          // Send initial chart data when the WebSocket connection is established
          socket.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 833,
            result: {
              ticks: [
                new Date().getTime() - 300000,
                new Date().getTime() - 240000,
                new Date().getTime() - 180000,
                new Date().getTime() - 120000,
                new Date().getTime() - 60000,
              ],
              open: [10000, 10100, 10200, 10300, 10400],
              high: [10050, 10150, 10250, 10350, 10450],
              low: [9950, 10050, 10150, 10250, 10350],
              close: [10000, 10100, 10200, 10300, 10400],
              volume: [1, 1, 1, 1, 1],
            },
          }));
        }
      });
    });
  };

  // Test to check if the component renders header and table
  it('should render header and table', async () => {
    sendInitialChartData();

    // Render the component
    render(<HistoricData />);

    // Check if the header and table are rendered
    expect(screen.getByText('Historic Data')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // Test to check if the fetched chart data is displayed
  it('should display fetched chart data', async () => {
    sendInitialChartData();

    render(<HistoricData />);

    // Wait for the chart data to be fetched and displayed
    await waitFor(() => {
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.getAllByText(/10000/)).toHaveLength(2);
    expect(screen.getAllByText(/10100/)).toHaveLength(2);
    });
  });
  
  it('should attempt to reopen WebSocket connection when closed', async () => {
    // Send initial chart data to the mock server
    sendInitialChartData();
  
    // Spy on the console's log and error methods
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    // Use Jest's fake timers
    jest.useFakeTimers();
  
    // Render the component
    render(<HistoricData />);
  
    // Close the mock server using the act method provided by react-testing-library to wait for the update to occur
    await act(async () => {
      mockServer.close();
    });
  
    // Advance timers, this will force the reconnect to happen immediately
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  
    // Wait for the 'WebSocket connection closed' message to appear
    await waitFor(() =>
      expect(consoleLogSpy).toHaveBeenCalledWith('WebSocket connection closed')
    );
  
    // Cleanup and restore real timers
    jest.useRealTimers();
  
    // Expect that the console log message WebSocket connection closed is called,
    // the console log message WebSocket connection established is called,
    // and the console error method was not called
    expect(consoleLogSpy).toHaveBeenCalledWith('WebSocket connection established');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  
    // Restore the console log and error spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
