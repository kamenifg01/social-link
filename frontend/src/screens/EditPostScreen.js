import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../config/api';
import axios from 'axios';

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [content, setContent] = useState(post.content);
  const [mediaFile, setMediaFile] = useState(post.mediaUrl ? {
    uri: post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}/api/${post.mediaUrl}`,
    type: post.mediaType,
    name: post.mediaMetadata?.originalName
  } : null);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à la galerie.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileExtension = asset.uri.split('.').pop();
        
        setMediaFile({
          uri: asset.uri,
          type: 'image',
          name: `image_${Date.now()}.${fileExtension}`,
          mimeType: `image/${fileExtension}`,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'image. Veuillez réessayer.');
    }
  };

  const handleUpdate = async () => {
    if (!content.trim() && !mediaFile) {
      Alert.alert('Erreur', 'Veuillez ajouter du texte ou une image à votre publication');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);

      if (mediaFile && !mediaFile.uri.startsWith('http')) {
        formData.append('media', {
          uri: mediaFile.uri,
          type: mediaFile.mimeType || 'image/jpeg',
          name: mediaFile.name
        });
      }

      await axios.put(`${API_URL}/api/posts/${post.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Succès', 'Publication mise à jour avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la publication');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.updateButton,
            { backgroundColor: content.trim() || mediaFile ? colors.primary : colors.border }
          ]}
          onPress={handleUpdate}
          disabled={isLoading || (!content.trim() && !mediaFile)}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.updateButtonText}>Mettre à jour</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Que souhaitez-vous partager ?"
          placeholderTextColor={colors.text + '80'}
          multiline
          value={content}
          onChangeText={setContent}
        />

        {mediaFile && (
          <View style={styles.mediaPreview}>
            <Image
              source={{ uri: mediaFile.uri }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeMediaButton}
              onPress={removeMedia}
            >
              <Icon name="times-circle" size={22} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}

        {!mediaFile && (
          <TouchableOpacity
            style={[styles.addMediaButton, { backgroundColor: colors.border + '20' }]}
            onPress={handlePickImage}
          >
            <Icon name="image" size={24} color={colors.primary} />
            <Text style={[styles.addMediaText, { color: colors.text }]}>
              Ajouter une image
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  updateButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  mediaPreview: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  addMediaText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditPostScreen; 