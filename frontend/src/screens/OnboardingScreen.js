import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateProfile } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    title: '',
    company: '',
    location: '',
    bio: '',
  });

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur est requis');
      return;
    }

    try {
      await updateProfile(formData);
      await AsyncStorage.setItem('profile', JSON.stringify(formData));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.replace('HomeTabs');
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      Alert.alert('Erreur', 'Impossible de créer le profil');
    }
  };

  const renderInput = (label, field, placeholder, required = false, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        placeholder={placeholder}
        placeholderTextColor={colors.text + '80'}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Icon name="user-circle" size={80} color="#0073b1" />
          <Text style={[styles.title, { color: colors.text }]}>
            Configurez votre profil
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Complétez vos informations pour commencer
          </Text>
        </View>

        {renderInput('Nom d\'utilisateur', 'username', 'Votre nom complet', true)}
        {renderInput('Titre professionnel', 'title', 'Ex: Développeur Full Stack')}
        {renderInput('Entreprise', 'company', 'Ex: Tech Company')}
        {renderInput('Localisation', 'location', 'Ex: Paris, France')}
        {renderInput('Bio', 'bio', 'Parlez de vous en quelques mots...', false, true)}

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Commencer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen; 