import React, { useState } from "react";
<<<<<<< Updated upstream
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
=======
import { View, TextInput, ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
>>>>>>> Stashed changes
import { login } from "../services/apiService";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
<<<<<<< Updated upstream
=======
import { useAuth } from '../hooks/useAuth';
>>>>>>> Stashed changes

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
<<<<<<< Updated upstream
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
=======
  const { updateAuthState } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
>>>>>>> Stashed changes

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

<<<<<<< Updated upstream
=======
    setLoading(true);
>>>>>>> Stashed changes
    try {
      console.log("Tentative de connexion...");
      const response = await login(email, password);
      console.log("Réponse API :", response);
  
<<<<<<< Updated upstream
      if (response && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        if (response.user) {
          await AsyncStorage.setItem('profile', JSON.stringify(response.user));
          const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
          if (!hasCompletedOnboarding) {
            await AsyncStorage.removeItem('hasCompletedOnboarding');
          }
          dispatch(loginSuccess(response.user));
        }
        console.log("Token stocké avec succès");
=======
      if (response && response.token && response.user) {
        // Mettre à jour le contexte d'authentification
        await updateAuthState(response.token, response.user);
        
        // Mettre à jour Redux
        dispatch(loginSuccess(response.user));
        
        console.log("Connexion réussie, redirection...");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
>>>>>>> Stashed changes
      } else {
        Alert.alert("Erreur", "Identifiants invalides");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Impossible de se connecter");
<<<<<<< Updated upstream
    }
  };
  
=======
    } finally {
      setLoading(false);
    }
  };
>>>>>>> Stashed changes

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Connexion</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { 
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholderTextColor={colors.text + '80'}
        keyboardType="email-address"
        autoCapitalize="none"
<<<<<<< Updated upstream
=======
        editable={!loading}
>>>>>>> Stashed changes
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { 
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholderTextColor={colors.text + '80'}
<<<<<<< Updated upstream
      />
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
=======
        editable={!loading}
      />
      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: colors.primary },
          loading && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('SignUp')}
        disabled={loading}
      >
>>>>>>> Stashed changes
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Pas encore de compte ? S'inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  input: { 
    width: '100%', 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
<<<<<<< Updated upstream
=======
  buttonDisabled: {
    opacity: 0.7,
  },
>>>>>>> Stashed changes
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linkText: {
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default LoginScreen;
