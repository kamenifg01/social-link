import { login, logout, getAuthToken } from '../authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

test('login stores token in AsyncStorage', async () => {
  const token = 'test-token';
  await login({ email: 'test@example.com', password: 'password' });
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', token);
});

test('logout removes token from AsyncStorage', async () => {
  await logout();
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
});

test('getAuthToken retrieves token from AsyncStorage', async () => {
  const token = 'test-token';
  AsyncStorage.getItem.mockResolvedValue(token);
  const result = await getAuthToken();
  expect(result).toBe(token);
}); 