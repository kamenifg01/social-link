import React from 'react';
import { render } from '@testing-library/react-native';
import PostDetailsScreen from '../PostDetailsScreen';

test('renders post details screen correctly', () => {
  const { getByText } = render(<PostDetailsScreen />);

  expect(getByText('Post Details')).toBeTruthy();
  // Ajoutez d'autres assertions pour vérifier les éléments spécifiques
}); 