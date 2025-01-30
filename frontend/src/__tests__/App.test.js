import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders app correctly', () => {
  const { getByText } = render(<App />);

  expect(getByText('Welcome to the App')).toBeTruthy();
  // Ajoutez d'autres assertions pour vérifier les éléments spécifiques
}); 