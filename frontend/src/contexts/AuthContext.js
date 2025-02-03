import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateAuthState = async (newToken, userData) => {
    try {
      // Mettre à jour les headers axios
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }

      // Mettre à jour l'état
      setToken(newToken);
      setUser(userData);

      // Stocker dans AsyncStorage
      if (newToken && userData) {
        await AsyncStorage.multiSet([
          ['userToken', newToken],
          ['user', JSON.stringify(userData)],
          ['profile', JSON.stringify(userData)]
        ]);
      }

      console.log('État d\'authentification mis à jour:', {
        hasToken: !!newToken,
        hasUser: !!userData,
        headers: axios.defaults.headers.common['Authorization']
      });
    } catch (error) {
      console.error('Erreur mise à jour état auth:', error);
    }
  };

  const loadStoredAuth = async () => {
    try {
      const [[, storedToken], [, storedUser], [, storedProfile]] = 
        await AsyncStorage.multiGet(['userToken', 'user', 'profile']);

      let userData = null;
      if (storedUser) {
        userData = JSON.parse(storedUser);
      } else if (storedProfile) {
        userData = JSON.parse(storedProfile);
      }

      if (storedToken && userData) {
        await updateAuthState(storedToken, userData);
        console.log('Authentification restaurée avec succès');
      } else {
        console.log('Pas de données d\'authentification valides');
        await clearAuth();
      }
    } catch (error) {
      console.error('Erreur chargement auth:', error);
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'user']);
      await updateAuthState(null, null);
      console.log('Authentification effacée');
    } catch (error) {
      console.error('Erreur nettoyage auth:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token: newToken, user: userData } = response.data;

      if (!newToken || !userData) {
        throw new Error('Données de connexion invalides');
      }

      await updateAuthState(newToken, userData);
      return { success: true };
    } catch (error) {
      console.error('Erreur login:', error);
      await clearAuth();
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const isAuthenticated = () => {
    const isAuth = !!token && !!user;
    console.log('Vérification auth:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuth
    });
    return isAuth;
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout: clearAuth,
      isAuthenticated,
      updateAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 