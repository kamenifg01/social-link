import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../Header';

test('renders header with title and icons', () => {
  const { getByText, getByTestId } = render(<Header title="App Header" />);

  expect(getByText('App Header')).toBeTruthy();
  expect(getByTestId('search-icon')).toBeTruthy();
  expect(getByTestId('notification-icon')).toBeTruthy();
}); 