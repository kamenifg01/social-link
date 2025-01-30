import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

test('renders correctly and responds to press', () => {
  const onPressMock = jest.fn();
  const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);

  const button = getByText('Click Me');
  fireEvent.press(button);

  expect(onPressMock).toHaveBeenCalled();
}); 