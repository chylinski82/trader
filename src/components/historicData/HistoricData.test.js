import React from 'react';
import { render, screen } from '@testing-library/react';
import HistoricData from './HistoricData';
import useHistoricData from './useHistoricData';

// Mock the useHistoricData hook
jest.mock('./useHistoricData', () => jest.fn());

describe('HistoricData component', () => {
  // Test to check if the component renders header and table
  it('should render header and table', () => {
    // Mock the data returned by useHistoricData
    useHistoricData.mockReturnValue([
      {
        timestamp: new Date(),
        open: 10000,
        high: 10050,
        low: 9950,
        close: 10000,
        volume: 1,
      },
    ]);

    // Render the component
    render(<HistoricData />);

    // Check if the header and table are rendered
    expect(screen.getByText('Historic Data')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // Test to check if the fetched chart data is displayed
  it('should display fetched chart data', () => {
    // Mock the data returned by useHistoricData
    useHistoricData.mockReturnValue([
      {
        timestamp: new Date(),
        open: 10000,
        high: 10050,
        low: 9950,
        close: 10000,
        volume: 1,
      },
    ]);

    render(<HistoricData />);

    // Check if the fetched data is displayed
    expect(screen.getAllByRole('row')).toHaveLength(2); // Header row + one data row
    expect(screen.getAllByText(/10000/)).toHaveLength(2);
    expect(screen.getByText(/10050/)).toBeInTheDocument();
    expect(screen.getByText(/9950/)).toBeInTheDocument();
    expect(screen.getByText(/1.00/)).toBeInTheDocument();
  });
});

