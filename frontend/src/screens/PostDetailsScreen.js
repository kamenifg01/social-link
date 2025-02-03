import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
=======
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  Alert, 
  Image, 
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
>>>>>>> Stashed changes
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { removePost } from '../redux/postSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updatePost, deletePost, fetchProfil, likePost } from '../services/apiService';
import Share from 'expo-sharing';
<<<<<<< Updated upstream

const PostDetailsScreen = ({ route, navigation }) => {
  const { post } = route.params || {};

=======
import axios from 'axios';
import { API_URL } from '../config';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

const PostDetailsScreen = ({ route, navigation }) => {
  const { post } = route.params || {};
  const { colors } = useTheme();
  
>>>>>>> Stashed changes
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);

  const isOwner = post.userId === userId;

  const [userProfile, setUserProfile] = useState({ name: '', title: '', picture: '' });
<<<<<<< Updated upstream
=======
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
>>>>>>> Stashed changes

  useEffect(() => {
    const loadUserProfile = async () => {
      const profileData = await fetchProfil();
      setUserProfile(profileData);
    };
    loadUserProfile();
<<<<<<< Updated upstream
  }, []);

=======
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${post.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      Alert.alert('Erreur', 'Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${post.id}/comments`, {
        content: newComment.trim()
      });
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le commentaire');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce commentaire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/comments/${commentId}`);
              setComments(prevComments => 
                prevComments.filter(comment => comment.id !== commentId)
              );
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le commentaire');
            }
          }
        }
      ]
    );
  };

  const renderComment = ({ item }) => {
    const isCommentOwner = item.author?.id === userId;
    const formattedDate = formatDistanceToNow(new Date(item.createdAt), {
      addSuffix: true,
      locale: fr
    });

    return (
      <View style={[styles.commentContainer, { backgroundColor: colors.card }]}>
        <View style={styles.commentHeader}>
          {item.author?.avatar ? (
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.commentAvatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Icon name="person" size={16} color={colors.text} />
            </View>
          )}
          <View style={styles.commentInfo}>
            <Text style={[styles.commentAuthor, { color: colors.text }]}>
              {item.author?.username || 'Utilisateur inconnu'}
            </Text>
            <Text style={[styles.commentTimestamp, { color: colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
          {isCommentOwner && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteComment(item.id)}
            >
              <Icon name="delete" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.commentContent, { color: colors.text }]}>
          {item.content}
        </Text>
      </View>
    );
  };

>>>>>>> Stashed changes
  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erreur : Aucun post trouvé.</Text>
      </View>
    );
  }

  return (
<<<<<<< Updated upstream
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
=======
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View>
            <View style={styles.userProfileContainer}>
              <Image source={{ uri: userProfile.picture }} style={styles.userProfilePicture} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{userProfile.name}</Text>
                <Text style={[styles.userTitle, { color: colors.textSecondary }]}>{userProfile.title}</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: colors.primary }]}>{post.title}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>
            <View style={styles.iconContainer}>
              {isOwner && (
                <>
                  <Icon name="edit" size={30} color={colors.primary} onPress={() => navigation.navigate('EditPost', { post })} />
                  <Icon name="delete" size={30} color={colors.error} onPress={handleDeletePost} />
                </>
              )}
              <Icon name="thumb-up" size={30} color={colors.primary} onPress={handleLikePost} />
              <Icon name="share" size={30} color={colors.primary} onPress={handleSharePost} />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              Commentaires ({comments.length})
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun commentaire pour le moment
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )
        }
      />

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          placeholder="Écrivez un commentaire..."
          placeholderTextColor={colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: newComment.trim() ? colors.primary : colors.border,
              opacity: sending ? 0.7 : 1
            }
          ]}
          onPress={handleSendComment}
          disabled={!newComment.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
>>>>>>> Stashed changes
  );
};

PostDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    padding: 20,
    backgroundColor: '#f3f2ef',
=======
>>>>>>> Stashed changes
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< Updated upstream
    color: '#0073b1',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
=======
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  content: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
>>>>>>> Stashed changes
  },
  error: {
    fontSize: 18,
    color: 'red',
<<<<<<< Updated upstream
=======
    padding: 20,
>>>>>>> Stashed changes
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
<<<<<<< Updated upstream
    marginTop: 20,
=======
    paddingVertical: 15,
    paddingHorizontal: 20,
>>>>>>> Stashed changes
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< Updated upstream
    marginBottom: 10,
=======
    padding: 20,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    color: '#666',
=======
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  commentContainer: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentTimestamp: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
>>>>>>> Stashed changes
  },
});

export default PostDetailsScreen;
