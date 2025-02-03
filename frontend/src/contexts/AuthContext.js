import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< Updated upstream
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
=======
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const [storedToken, storedUser] = await AsyncStorage.multiGet(['userToken', 'user']);
      
      if (storedToken[1] && storedUser[1]) {
        const parsedUser = JSON.parse(storedUser[1]);
        
        // Configurer axios avec le token stocké
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken[1]}`;
        
        try {
          // Vérifier si le token est toujours valide
          const verifyResponse = await axios.get(`${API_URL}/auth/verify`);
          
          if (verifyResponse.data.isValid) {
            setToken(storedToken[1]);
            setUser(parsedUser);
            console.log('Session restaurée avec succès');
          } else {
            throw new Error('Token invalide');
          }
        } catch (error) {
          console.log('Tentative de rafraîchissement du token...');
          try {
            const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
              token: storedToken[1]
            });
            
            if (refreshResponse.data.token) {
              await updateAuthState(refreshResponse.data.token, parsedUser);
              console.log('Token rafraîchi avec succès');
            } else {
              throw new Error('Échec du rafraîchissement');
            }
          } catch (refreshError) {
            console.log('Échec du rafraîchissement, nouvelle connexion requise');
            await clearAuth();
          }
        }
      } else {
        console.log('Aucune session trouvée');
        await clearAuth();
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
>>>>>>> Stashed changes
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'user']);
      await updateAuthState(null, null);
      console.log('Authentification effacée');
=======
  const updateAuthState = async (newToken, userData) => {
    try {
      if (newToken && userData) {
        // Configurer axios avec le nouveau token
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Stocker dans AsyncStorage
        await AsyncStorage.multiSet([
          ['userToken', newToken],
          ['user', JSON.stringify(userData)]
        ]);

        // Mettre à jour le state
        setToken(newToken);
        setUser(userData);
        console.log('État d\'authentification mis à jour avec succès');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur mise à jour auth:', error);
      return false;
    }
  };

  const clearAuth = async () => {
    try {
      delete axios.defaults.headers.common['Authorization'];
      await AsyncStorage.multiRemove(['userToken', 'user']);
      setToken(null);
      setUser(null);
      console.log('Session terminée et nettoyée');
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Erreur nettoyage auth:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
<<<<<<< Updated upstream
      const { token: newToken, user: userData } = response.data;

      if (!newToken || !userData) {
        throw new Error('Données de connexion invalides');
      }

      await updateAuthState(newToken, userData);
      return { success: true };
    } catch (error) {
      console.error('Erreur login:', error);
      await clearAuth();
=======
      
      if (response.data.token && response.data.user) {
        const success = await updateAuthState(response.data.token, response.data.user);
        return { success, user: response.data.user };
      } else {
        throw new Error('Données de connexion invalides');
      }
    } catch (error) {
      console.error('Erreur login:', error);
>>>>>>> Stashed changes
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

<<<<<<< Updated upstream
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
=======
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      await clearAuth();
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };
>>>>>>> Stashed changes

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
<<<<<<< Updated upstream
      logout: clearAuth,
      isAuthenticated,
      updateAuthState
    }}>
      {children}
=======
      logout,
      isAuthenticated,
      updateAuthState,
      checkAuthStatus
    }}>
      {!loading && children}
>>>>>>> Stashed changes
    </AuthContext.Provider>
  );
}; 