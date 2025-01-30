// Définition des thèmes
const lightTheme = {
  colors: {
    primary: '#0073b1',
    secondary: '#32CD32',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#000000',
    textSecondary: '#666666',
    border: '#e1e1e1',
    card: '#ffffff',
    notification: '#ff3b30',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f1c40f',
    info: '#3498db',
    inputBackground: '#f0f0f0',
  },
  spacing: {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  fonts: {
    regular: 'Arial',
    bold: 'Arial-Bold',
    italic: 'Arial-Italic',
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    xl: 24,
  },
};

const darkTheme = {
  colors: {
    primary: '#0073b1',
    secondary: '#32CD32',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#999999',
    border: '#404040',
    card: '#2d2d2d',
    notification: '#ff453a',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f1c40f',
    info: '#3498db',
    inputBackground: '#444444',
  },
  spacing: {
    ...lightTheme.spacing,
  },
  fonts: {
    ...lightTheme.fonts,
  },
  borderRadius: {
    ...lightTheme.borderRadius,
  },
};

export { lightTheme, darkTheme };

export const getTheme = (isDarkMode) => {
  return isDarkMode ? darkTheme : lightTheme;
};
  