import React from 'react';
import { render } from '@testing-library/react-native';
import NotificationIcon from '../NotificationIcon';

test('renders notification icon with badge', () => {
  const { getByText } = render(<NotificationIcon count={5} />);

  expect(getByText('5')).toBeTruthy();
}); 