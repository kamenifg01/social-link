import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { removePost } from '../redux/postSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updatePost, deletePost, fetchProfil, likePost } from '../services/apiService';
import Share from 'expo-sharing';

const PostDetailsScreen = ({ route, navigation }) => {
  const { post } = route.params || {};

  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);

  const isOwner = post.userId === userId;

  const [userProfile, setUserProfile] = useState({ name: '', title: '', picture: '' });

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchProfil();
      setUserProfile(profileData);
    };
    loadUserProfile();
  }, []);

  const handleDelete = () => {
    dispatch(removePost(post.id));
    navigation.goBack();
  };

  const handleUpdatePost = async (updatedData) => {
    try {
      await updatePost(post.id, updatedData);
      Alert.alert('Succès', 'Post mis à jour avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post :', error.message);
      Alert.alert('Erreur', 'Échec de la mise à jour du post');
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      Alert.alert('Succès', 'Post supprimé avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la suppression du post :', error.message);
      Alert.alert('Erreur', 'Échec de la suppression du post');
    }
  };

  const handleLikePost = async () => {
    try {
      await likePost(post.id);
      Alert.alert('Succès', 'Vous avez aimé ce post !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du like :', error.message);
      Alert.alert('Erreur', 'Échec de l\'ajout du like');
    }
  };

  const handleSharePost = async () => {
    try {
      const shareOptions = {
        message: `Check out this post: ${post.title} - ${post.content}`,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Erreur lors du partage du post :', error.message);
      Alert.alert('Erreur', 'Échec du partage du post');
    }
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erreur : Aucun post trouvé.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userProfileContainer}>
        <Image source={{ uri: userProfile.picture }} style={styles.userProfilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userTitle}>{userProfile.title}</Text>
        </View>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.iconContainer}>
        {isOwner && (
          <>
            <Icon name="edit" size={30} color="#0073b1" onPress={() => navigation.navigate('EditPost', { post })} />
            <Icon name="delete" size={30} color="red" onPress={handleDeletePost} />
          </>
        )}
      </View>
      <Button title="Modifier" onPress={() => handleUpdatePost({ title: 'Nouveau titre', content: 'Nouveau contenu' })} />
      <Button title="Supprimer" onPress={handleDeletePost} color="red" />
      <Button title="Like" onPress={handleLikePost} />
      <Button title="Partager" onPress={handleSharePost} />
    </View>
  );
};

PostDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f2ef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0073b1',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userTitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default PostDetailsScreen;
