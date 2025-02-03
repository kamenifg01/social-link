import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

test('renders login screen correctly', () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);

  expect(getByPlaceholderText('Email')).toBeTruthy();
  expect(getByPlaceholderText('Password')).toBeTruthy();
  expect(getByText('Login')).toBeTruthy();
});

test('handles login button press', () => {
  const { getByText } = render(<LoginScreen />);
  const loginButton = getByText('Login');

  fireEvent.press(loginButton);

  // Ajoutez des assertions pour vérifier le comportement après le clic
}); 