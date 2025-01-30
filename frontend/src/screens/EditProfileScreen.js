import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../services/apiService';

const EditProfileScreen = ({ navigation, route }) => {
  const { profile } = route.params;
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    title: profile?.title || '',
    company: profile?.company || '',
  });
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture);
  const { colors } = useTheme();

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (profilePicture) {
        formDataToSend.append('profilePicture', {
          uri: profilePicture,
          type: 'image/jpeg',
          name: 'profile-picture.jpg',
        });
      }

      await updateProfile(formDataToSend);
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Icon name="user" size={40} color={colors.text} />
            </View>
          )}
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={handlePickImage}
          >
            <Icon name="camera" size={16} color={colors.background} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handlePickImage}>
          <Text style={[styles.photoText, { color: colors.primary }]}>
            Changer la photo
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Nom d'utilisateur</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          placeholder="Votre nom d'utilisateur"
          placeholderTextColor={colors.text + '80'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Biographie</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          placeholder="Parlez-nous de vous"
          placeholderTextColor={colors.text + '80'}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Localisation</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
          placeholder="Votre localisation"
          placeholderTextColor={colors.text + '80'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Site web</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.website}
          onChangeText={(text) => setFormData({ ...formData, website: text })}
          placeholder="Votre site web"
          placeholderTextColor={colors.text + '80'}
          keyboardType="url"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Titre professionnel</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Votre titre professionnel"
          placeholderTextColor={colors.text + '80'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Entreprise</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card
            }
          ]}
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
          placeholder="Votre entreprise"
          placeholderTextColor={colors.text + '80'}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: colors.background }]}>
          Enregistrer
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 30,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 