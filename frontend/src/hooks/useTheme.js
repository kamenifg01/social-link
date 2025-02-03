import { useContext } from 'react';
import { ThemeContext } from '../navigation/AppNavigator';
import { getTheme } from '../styles/theme';

export const useTheme = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = getTheme(isDarkMode);

  return {
    theme,
    isDarkMode,
    toggleTheme,
  };
}; 