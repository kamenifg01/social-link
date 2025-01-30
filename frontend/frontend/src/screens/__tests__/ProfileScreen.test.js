import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';

test('renders profile screen correctly', () => {
  const { getByText } = render(<ProfileScreen />);

  expect(getByText('User Profile')).toBeTruthy();
  // Ajoutez d'autres assertions pour vérifier les éléments spécifiques
});

test('allows user to edit profile', () => {
  const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

  fireEvent.changeText(getByPlaceholderText('Name'), 'New Name');
  fireEvent.press(getByText('Save'));

  // Ajoutez des assertions pour vérifier que les modifications ont été enregistrées
}); 