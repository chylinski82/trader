import { renderHook, act } from '@testing-library/react-hooks';
import { Server } from 'mock-socket';
import useHistoricData from './useHistoricData';
import { WebSocket as MockWebSocket } from 'mock-socket';

// Mock WebSocket
global.WebSocket = MockWebSocket;

describe('useHistoricData hook', () => {
  let mockServer;

  beforeEach(() => {
    // Create a new Mock WebSocket server before each test
    mockServer = new Server('wss://test.deribit.com/ws/api/v2');
  });

  afterEach(() => {
    // Close the Mock WebSocket server after each test
    mockServer.close();
  });

  // Move your sendInitialChartData function here

  // Move your should display fetched chart data test here and modify it
  it('should fetch chart data', async () => {
    sendInitialChartData();

    const { result, waitForNextUpdate } = renderHook(() => useHistoricData());

    // Wait for the chart data to be fetched
    await waitForNextUpdate();

    // Check if the fetched data has the expected length
    expect(result.current.length).toBe(5);

    // Check if the data has the expected values
    expect(result.current[0].open).toBe(10000);
    expect(result.current[0].high).toBe(10050);
    expect(result.current[0].low).toBe(9950);
    expect(result.current[0].close).toBe(10000);
    expect(result.current[0].volume).toBe(1);
  });

  // should attempt to reopen WebSocket connection when closed test here and modify it
  it('should attempt to reopen WebSocket connection when closed', async () => {
    // All the necessary code for this test stays the same
    // ...
  });
});

