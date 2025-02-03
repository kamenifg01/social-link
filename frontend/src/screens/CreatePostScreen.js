<<<<<<< Updated upstream
import React, { useState, useContext } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> Stashed changes
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
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import { createPost } from '../services/apiService';
<<<<<<< Updated upstream
import { ThemeContext } from '../navigation/AppNavigator';
import { useTheme } from '@react-navigation/native';
=======
import { useTheme } from '../contexts/ThemeContext';
>>>>>>> Stashed changes

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< Updated upstream
  const { isDarkMode } = useContext(ThemeContext);
=======
  const { isDarkMode } = useTheme();
>>>>>>> Stashed changes
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const { colors } = useTheme();

  const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à vos médias.'
      );
      return false;
    }
    return true;
  };

  const handleBackPress = () => {
    if (content.trim() || mediaFiles.length > 0) {
      Alert.alert(
        'Abandonner la publication',
        'Êtes-vous sûr de vouloir abandonner cette publication ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Abandonner',
            style: 'destructive',
            onPress: () => {
              setContent('');
              setMediaFiles([]);
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

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
        
        const newFile = {
          uri: asset.uri,
          type: 'image',
          name: `image_${Date.now()}.${fileExtension}`,
          mimeType: `image/${fileExtension}`,
        };
        
        setMediaFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'image. Veuillez réessayer.');
    }
  };

  const handlePickVideo = async () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileExtension = asset.uri.split('.').pop();

        try {
          const thumbnail = await VideoThumbnails.getThumbnailAsync(asset.uri, {
            time: 0,
          });

          const newFile = {
            uri: asset.uri,
            type: 'video',
            name: `video_${Date.now()}.${fileExtension}`,
            mimeType: `video/${fileExtension}`,
            thumbnail: thumbnail.uri,
          };
          
          setMediaFiles(prev => [...prev, newFile]);
        } catch (thumbnailError) {
          console.error('Erreur lors de la génération de la miniature:', thumbnailError);
          Alert.alert('Erreur', 'Impossible de générer la miniature de la vidéo.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de la vidéo:', error);
      Alert.alert('Erreur', 'Impossible de charger la vidéo. Veuillez réessayer.');
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
<<<<<<< Updated upstream
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
=======
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        const fileExtension = result.uri.split('.').pop();
        const mimeType = {
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'txt': 'text/plain'
        }[fileExtension] || 'application/octet-stream';

>>>>>>> Stashed changes
        const newFile = {
          uri: result.uri,
          type: 'document',
          name: result.name,
<<<<<<< Updated upstream
          size: result.size,
          mimeType: result.mimeType,
        };
=======
          mimeType: mimeType
        };

>>>>>>> Stashed changes
        setMediaFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du document:', error);
<<<<<<< Updated upstream
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
=======
      Alert.alert('Erreur', 'Impossible de charger le document. Veuillez réessayer.');
>>>>>>> Stashed changes
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
<<<<<<< Updated upstream
    if (!content.trim() && mediaFiles.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter du contenu ou des médias à votre publication');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim() || "Partagé un média");
      
      mediaFiles.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type === 'document' ? file.mimeType : `${file.type}/*`,
          name: file.type === 'document' ? file.name : `${file.type}_${index}.${file.uri.split('.').pop()}`
        });
      });

      await createPost(formData);
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de publier le post. Veuillez réessayer plus tard.'
=======
    try {
      if (!content.trim() && mediaFiles.length === 0) {
        Alert.alert('Erreur', 'Veuillez ajouter du texte ou un média à votre publication');
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append('content', content);

      if (mediaFiles.length > 0) {
        const file = mediaFiles[0];
        formData.append('media', {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          type: file.mimeType,
          name: file.name
        });
      }

      const response = await createPost(formData);
      
      if (response) {
        setContent('');
        setMediaFiles([]);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      Alert.alert(
        'Erreur',
        'Impossible de publier votre message. Veuillez réessayer.'
>>>>>>> Stashed changes
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaPreview = () => (
    <ScrollView
      horizontal
      style={styles.mediaPreviewContainer}
      showsHorizontalScrollIndicator={false}
    >
      {mediaFiles.map((file, index) => (
        <View key={index} style={[
          styles.mediaPreview,
          { backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5' }
        ]}>
          {file.type === 'image' ? (
            <Image 
              source={{ uri: file.uri }} 
              style={styles.mediaPreviewImage}
              resizeMode="cover"
            />
          ) : file.type === 'video' ? (
            <View style={styles.mediaPreviewVideo}>
              <Image 
                source={{ uri: file.thumbnail }} 
                style={styles.mediaPreviewImage}
                resizeMode="cover"
              />
              <View style={styles.videoIndicator}>
                <Icon name="play-circle" size={30} color="#fff" />
              </View>
            </View>
          ) : (
            <View style={styles.documentPreview}>
              <Icon name="file" size={40} color={colors.primary} />
              <Text style={[
                styles.documentName, 
                { color: isDarkMode ? '#fff' : '#000' }
              ]} numberOfLines={2}>
                {file.name}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.removeMediaButton}
            onPress={() => removeMedia(index)}
          >
            <Icon name="times-circle" size={22} color="#ff4444" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderUploadMenu = () => (
    <Modal
      transparent
      visible={showUploadMenu}
      animationType="fade"
      onRequestClose={() => setShowUploadMenu(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowUploadMenu(false)}
      >
        <View style={[
          styles.uploadMenu,
          { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' },
          { position: 'absolute', bottom: 70, left: 15 }
        ]}>
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => {
              handlePickImage();
              setShowUploadMenu(false);
            }}
          >
            <Icon name="image" size={20} color={colors.primary} />
            <Text style={[styles.uploadOptionText, { color: isDarkMode ? '#fff' : '#000' }]}>
              Photo
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.optionDivider, { backgroundColor: isDarkMode ? '#404040' : '#e1e1e1' }]} />
          
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => {
              handlePickVideo();
              setShowUploadMenu(false);
            }}
          >
            <Icon name="video-camera" size={20} color={colors.primary} />
            <Text style={[styles.uploadOptionText, { color: isDarkMode ? '#fff' : '#000' }]}>
              Vidéo
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.optionDivider, { backgroundColor: isDarkMode ? '#404040' : '#e1e1e1' }]} />
          
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => {
              handlePickDocument();
              setShowUploadMenu(false);
            }}
          >
            <Icon name="file" size={20} color={colors.primary} />
            <Text style={[styles.uploadOptionText, { color: isDarkMode ? '#fff' : '#000' }]}>
              Document
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333' : '#e1e1e1' }]}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="times" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.postButton,
            { backgroundColor: content.trim() || mediaFiles.length > 0 ? colors.primary : isDarkMode ? '#444' : '#e1e1e1' }
          ]}
          onPress={handlePost}
          disabled={isLoading || (!content.trim() && mediaFiles.length === 0)}
        >
          {isLoading ? (
            <ActivityIndicator color={isDarkMode ? '#fff' : '#000'} size="small" />
          ) : (
            <Text style={[
              styles.postButtonText,
              { color: content.trim() || mediaFiles.length > 0 ? colors.background : isDarkMode ? '#999' : '#666' }
            ]}>
              Publier
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.input,
          { color: isDarkMode ? '#fff' : '#000', backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
        ]}
        placeholder="Que souhaitez-vous partager ?"
        placeholderTextColor={isDarkMode ? '#999' : '#666'}
        multiline
        value={content}
        onChangeText={setContent}
      />

      {mediaFiles.length > 0 && renderMediaPreview()}
      {renderUploadMenu()}

      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: isDarkMode ? '#333' : '#f3f3f3' }]}
        onPress={() => setShowUploadMenu(true)}
      >
        <Icon name="plus-circle" size={20} color={colors.primary} />
        <Text style={[styles.uploadButtonText, { color: isDarkMode ? '#fff' : '#666' }]}>
          Média
        </Text>
      </TouchableOpacity>
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
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontWeight: '600',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  mediaPreviewContainer: {
    padding: 15,
    maxHeight: 200,
  },
  mediaPreview: {
    marginRight: 15,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mediaPreviewImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  mediaPreviewVideo: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIndicator: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  uploadMenu: {
    width: 160,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  uploadOptionText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  optionDivider: {
    height: 1,
    width: '100%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 15,
    alignSelf: 'flex-start',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  documentPreview: {
    width: 180,
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 115, 177, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  documentName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});

export default CreatePostScreen;
