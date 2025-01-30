import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OptionsScreen from '../OptionsScreen';

test('renders options screen correctly', () => {
  const { getByText } = render(<OptionsScreen />);

  expect(getByText('Options')).toBeTruthy();
  // Ajoutez d'autres assertions pour vérifier les éléments spécifiques
}); 