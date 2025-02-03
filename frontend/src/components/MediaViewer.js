import React, { useState } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';

const MediaViewer = ({ isVisible, mediaUrl, mediaType, onClose }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const renderMedia = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={50} color={colors.error} />
        </View>
      );
    }

    switch (mediaType) {
      case 'image':
        return (
          <Image
            source={{ uri: mediaUrl }}
            style={styles.media}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            resizeMode="contain"
          />
        );
      case 'video':
        return (
          <Video
            source={{ uri: mediaUrl }}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            onLoadStart={handleLoadStart}
            onLoad={handleLoadEnd}
            onError={handleError}
            shouldPlay={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Icon name="times" size={25} color="#fff" />
        </TouchableOpacity>

        {renderMedia()}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaViewer; 