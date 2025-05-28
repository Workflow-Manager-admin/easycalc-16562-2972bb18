import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

// Helper to click buttons by aria-label
const clickButtons = async (buttons) => {
  for (const btn of buttons) {
    await userEvent.click(screen.getByRole('button', { name: btn }));
  }
};

describe('Calculator Component', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  test('renders display area and all calculator buttons', () => {
    expect(screen.getByTestId('calc-display')).toBeInTheDocument();
    const buttonLabels = [
      'C', '÷', '×', '←',
      '7', '8', '9', '-',
      '4', '5', '6', '+',
      '1', '2', '3', '=',
      '0', '.'
    ];
    for (const label of buttonLabels) {
      expect(
        screen.getByRole('button', { name: label })
      ).toBeInTheDocument();
    }
  });

  test('addition: 5 + 6 = 11', async () => {
    await clickButtons(['5', '+', '6', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('11');
  });

  test('subtraction: 8 - 3 = 5', async () => {
    await clickButtons(['8', '-', '3', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('5');
  });

  test('multiplication: 7 × 6 = 42', async () => {
    await clickButtons(['7', '×', '6', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('42');
  });

  test('division: 12 ÷ 4 = 3', async () => {
    await clickButtons(['1', '2', '÷', '4', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('3');
  });

  test('clear (C) resets the display and state', async () => {
    await clickButtons(['9', '+', '1', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('10');
    await clickButtons(['C']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');
  });

  test('backspace (←) erases last digit', async () => {
    await clickButtons(['1', '2', '3']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('123');
    await clickButtons(['←']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('12');
    await clickButtons(['←']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('1');
    await clickButtons(['←']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');
  });

  test('displays error on divide by zero', async () => {
    await clickButtons(['4', '÷', '0', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent(/Error/i);
  });

  test('error state can be cleared with C', async () => {
    await clickButtons(['5', '÷', '0', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent(/Error/i);
    await clickButtons(['C']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');
  });

  test('decimal input works: 3.5 + 2.2 = 5.7', async () => {
    await clickButtons(['3', '.', '5', '+', '2', '.', '2', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('5.7');
  });

  test('multiple decimal points in one number not allowed', async () => {
    await clickButtons(['1', '.', '2', '.', '3']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('1.23');
  });

  test('operator replacement: 9 + - 5 = 4', async () => {
    await clickButtons(['9', '+', '-', '5', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('4');
  });

  test('chaining: 2 + 3 × 4 = 14 (respecting order of operations)', async () => {
    await clickButtons(['2', '+', '3', '×', '4', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('14');
  });

  test('multiple operations without pressing equal: 2 + 2 + 2 (then =) = 6', async () => {
    await clickButtons(['2', '+', '2', '+', '2', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('6');
  });

  test('pressing "=" after error resets to 0', async () => {
    await clickButtons(['5', '÷', '0', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent(/Error/i);
    await clickButtons(['=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');
  });

  test('starts new entry after operator', async () => {
    await clickButtons(['3', '+', '5']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('5');
  });

  test('leading zeros are handled correctly', async () => {
    await clickButtons(['0', '0', '1', '2']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('12');
  });

  test('displays result as integer if no decimals, as float if needed', async () => {
    await clickButtons(['7', '÷', '2', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('3.5');
    await clickButtons(['C', '8', '÷', '4', '=']);
    expect(screen.getByTestId('calc-display')).toHaveTextContent('2');
  });
});
