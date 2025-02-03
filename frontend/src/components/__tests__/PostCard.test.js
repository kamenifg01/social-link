import React from 'react';
import { render } from '@testing-library/react-native';
import PostCard from '../PostCard';

test('renders post card with title and content', () => {
  const post = { title: 'Sample Post', content: 'This is a sample post content.' };
  const { getByText } = render(<PostCard post={post} />);

  expect(getByText('Sample Post')).toBeTruthy();
  expect(getByText('This is a sample post content.')).toBeTruthy();
}); 