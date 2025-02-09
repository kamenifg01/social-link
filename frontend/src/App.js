<<<<<<< Updated upstream
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { lightTheme, darkTheme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';

// Personnalisation des thèmes
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...lightTheme.colors,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...darkTheme.colors,
  },
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    // Exposer la fonction de mise à jour du thème globalement
    window.updateAppTheme = (isDark) => {
      setIsDarkMode(isDark);
    };

    return () => {
      delete window.updateAppTheme;
    };
  }, []);

  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationContainer theme={isDarkMode ? CustomDarkTheme : CustomLightTheme}>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </AuthProvider>
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';

const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <NavigationContainer theme={theme}>
      <AuthProvider>
        <OnboardingProvider>
          <AppNavigator />
        </OnboardingProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
>>>>>>> Stashed changes
  );
};

export default App;
