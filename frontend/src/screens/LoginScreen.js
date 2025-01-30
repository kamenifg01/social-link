import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { login } from "../services/apiService";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      console.log("Tentative de connexion...");
      const response = await login(email, password);
      console.log("Réponse API :", response);
  
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
      } else {
        Alert.alert("Erreur", "Identifiants invalides");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Impossible de se connecter");
    }
  };
  

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
      />
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
