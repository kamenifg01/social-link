import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

test('renders home screen correctly', () => {
  const { getByText } = render(<HomeScreen />);

  expect(getByText('Welcome to Home')).toBeTruthy();
  // Ajoutez d'autres assertions pour vérifier les éléments spécifiques
}); 