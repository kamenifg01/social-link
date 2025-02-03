import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
<<<<<<< Updated upstream
import { useTheme } from '../hooks/useTheme';
=======
import { useTheme } from '../contexts/ThemeContext';
>>>>>>> Stashed changes
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { API_URL } from '../config';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const CommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
<<<<<<< Updated upstream
=======
  const [post, setPost] = useState(null);
>>>>>>> Stashed changes
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
<<<<<<< Updated upstream
    loadComments();
  }, [postId]);

=======
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      setPost(response.data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le post');
    }
  };

>>>>>>> Stashed changes
  const loadComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        content: newComment.trim()
      });
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment('');
    } catch (error) {
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

<<<<<<< Updated upstream
=======
  const renderPost = () => {
    if (!post) return null;

    const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: fr
    });

    return (
      <View style={[styles.postContainer, { backgroundColor: theme.colors.card }]}>
        <View style={styles.postHeader}>
          {post.author?.avatar ? (
            <Image
              source={{ uri: post.author.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
              <Icon name="user" size={16} color={theme.colors.text} />
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {post.author?.username || 'Utilisateur inconnu'}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <Text style={[styles.postContent, { color: theme.colors.text }]}>
          {post.content}
        </Text>
        {post.mediaUrl && (
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.postMedia}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

>>>>>>> Stashed changes
  const renderComment = ({ item }) => {
    const isOwner = item.author?.id === user?.id;
    const formattedDate = formatDistanceToNow(new Date(item.createdAt), {
      addSuffix: true,
      locale: fr
    });

    return (
      <View style={[styles.commentContainer, { backgroundColor: theme.colors.card }]}>
        <View style={styles.commentHeader}>
          {item.author?.avatar ? (
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
              <Icon name="user" size={16} color={theme.colors.text} />
            </View>
          )}
          <View style={styles.commentInfo}>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {item.author?.username || 'Utilisateur inconnu'}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
          {isOwner && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteComment(item.id)}
            >
              <Icon name="trash" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.commentContent, { color: theme.colors.text }]}>
          {item.content}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.commentsList}
<<<<<<< Updated upstream
=======
        ListHeaderComponent={renderPost}
>>>>>>> Stashed changes
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Aucun commentaire pour le moment
            </Text>
          </View>
        }
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
          placeholder="Écrivez un commentaire..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: newComment.trim() ? theme.colors.primary : theme.colors.border,
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsList: {
    padding: 15,
  },
  commentContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
<<<<<<< Updated upstream
=======
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
>>>>>>> Stashed changes
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
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
  authorName: {
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
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
<<<<<<< Updated upstream
=======
  postContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flex: 1,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
>>>>>>> Stashed changes
});

export default CommentsScreen; 