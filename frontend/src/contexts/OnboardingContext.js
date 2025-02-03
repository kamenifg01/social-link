import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingContext = createContext({
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: () => {},
});

export const OnboardingProvider = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(!!status);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'onboarding:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du statut d\'onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider 
      value={{
        hasCompletedOnboarding,
        setHasCompletedOnboarding: completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}; 