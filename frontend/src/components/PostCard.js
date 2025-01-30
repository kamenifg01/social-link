import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking, Alert, Share, TextInput, ActivityIndicator, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import { Video } from 'expo-av';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import PostOptionsMenu from './PostOptionsMenu';
import { likePost, unlikePost, repostPost, unrepostPost, sharePost, createComment, fetchComments } from '../services/apiService';

const PostCard = ({ post, onProfilePress, navigation, onShare, onUpdate, isProfileOwner }) => {
  const { theme } = useTheme();
  const { user, token, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isReposted, setIsReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  // Mettre à jour l'état des likes et reposts quand l'utilisateur change
  useEffect(() => {
    if (user && post) {
      setIsLiked(post.likes?.some(like => like.userId === user.id) || false);
      setIsReposted(post.reposts?.some(repost => repost.userId === user.id) || false);
    }
  }, [user, post]);

  // Vérification si on doit afficher le bouton de connexion
  const canShowConnectButton = !isProfileOwner && !post.originalPost && user?.id;

  console.log('Post options check:', {
    userId: user?.id,
    isProfileOwner,
    canShowConnect: canShowConnectButton
  });

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      console.log('Utilisateur non authentifié pour like');
      return;
    }

    try {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Erreur like:', error);
      // Restaurer l'état précédent en cas d'erreur
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleComment = () => {
    if (!isAuthenticated()) {
      console.log('Utilisateur non authentifié pour commenter');
      return;
    }
    setShowComments(!showComments);
  };

  const handleRepost = async () => {
    try {
      if (isReposted) {
        await unrepostPost(post.id);
        setRepostsCount(prev => prev - 1);
      } else {
        await repostPost(post.id);
        setRepostsCount(prev => prev + 1);
      }
      setIsReposted(!isReposted);
      if (onUpdate) onUpdate();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de gérer le repost");
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${post.content}\n\nPartagé depuis Social Link`,
        title: "Partager cette publication"
      });

      if (result.action === Share.sharedAction) {
        await sharePost(post.id, { platform: 'native' });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de partager la publication");
    }
  };

  const handleConnect = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/${post.author.id}/connect`);
      Alert.alert("Succès", "Demande de connexion envoyée");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'envoyer la demande de connexion");
    }
  };

  const handlePostPress = () => {
    setShowComments(!showComments);
  };

  const handleEdit = async () => {
    setShowOptions(false);
    navigation.navigate('EditPost', { post });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/posts/${post.id}`);
      Alert.alert("Succès", "Publication supprimée");
      if (onUpdate) onUpdate();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer la publication");
    }
    setShowOptions(false);
  };

  const handleReport = async () => {
    try {
      await axios.post(`${API_URL}/posts/${post.id}/report`);
      Alert.alert("Merci", "Votre signalement a été pris en compte");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de signaler la publication");
    }
    setShowOptions(false);
  };

  const handleHide = () => {
    Alert.alert("Info", "Cette publication ne s'affichera plus");
    setShowOptions(false);
  };

  const handleFollow = async () => {
    try {
      await axios.post(`${API_URL}/users/${post.author.id}/follow`);
      Alert.alert("Succès", "Vous suivez maintenant cet utilisateur");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de suivre cet utilisateur");
    }
    setShowOptions(false);
  };

  const loadComments = async () => {
    if (!showComments || !isAuthenticated()) return;
    
    setLoadingComments(true);
    try {
      const response = await fetchComments(post.id);
      setComments(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [showComments]);

  const handleSendComment = async () => {
    if (!isAuthenticated()) {
      console.log('Tentative d\'envoyer un commentaire sans authentification');
      return;
    }

    if (!newComment.trim()) return;

    setSendingComment(true);
    try {
      const response = await createComment(post.id, {
        content: newComment.trim()
      });
      setComments(prevComments => [...prevComments, response]);
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur envoi commentaire:', error);
    } finally {
      setSendingComment(false);
    }
  };

  const renderDocument = () => {
    const getFileIcon = () => {
      const extension = post.mediaMetadata?.originalName?.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          return 'file-pdf-o';
        case 'doc':
        case 'docx':
          return 'file-word-o';
        case 'xls':
        case 'xlsx':
          return 'file-excel-o';
        case 'ppt':
        case 'pptx':
          return 'file-powerpoint-o';
        default:
          return 'file-o';
      }
    };

    const handleDocumentPress = async () => {
      try {
        await Linking.openURL(post.mediaUrl);
      } catch (error) {
        console.error('Erreur lors de l\'ouverture du document:', error);
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.documentContainer, { backgroundColor: theme.colors.surface }]}
        onPress={handleDocumentPress}
      >
        <Icon name={getFileIcon()} size={30} color={theme.colors.primary} />
        <View style={styles.documentInfo}>
          <Text style={[styles.documentName, { color: theme.colors.text }]}>
            {post.mediaMetadata?.originalName || 'Document'}
          </Text>
          <Text style={[styles.documentSize, { color: theme.colors.textSecondary }]}>
            {post.mediaMetadata?.size ? `${Math.round(post.mediaMetadata.size / 1024)} KB` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    switch (post.mediaType) {
      case 'image':
        return (
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <TouchableOpacity 
            style={styles.videoContainer}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Video
              source={{ uri: post.mediaUrl }}
              style={styles.video}
              shouldPlay={isPlaying}
              resizeMode="cover"
              isLooping
              useNativeControls
            />
            {!isPlaying && (
              <View style={styles.playButton}>
                <Icon name="play" size={30} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        );
      case 'document':
        return renderDocument();
      default:
        return null;
    }
  };

  const renderSharedPost = () => {
    if (post.originalPost) {
      return (
        <View style={[styles.sharedPostContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.authorInfo} 
              onPress={() => onProfilePress(post.originalPost.author)}
            >
              {post.originalPost.author?.avatar ? (
                <Image
                  source={{ uri: post.originalPost.author.avatar }}
                  style={styles.avatarSmall}
                />
              ) : (
                <View style={[styles.avatarPlaceholderSmall, { backgroundColor: theme.colors.border }]}>
                  <Icon name="user" size={16} color={theme.colors.text} />
                </View>
              )}
              <Text style={[styles.authorName, { color: theme.colors.text }]}>
                {post.originalPost.author?.username || 'Utilisateur inconnu'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.content, { color: theme.colors.text }]}>
            {post.originalPost.content}
          </Text>
          {post.originalPost.mediaUrl && renderMedia()}
        </View>
      );
    }
    return null;
  };

  const renderCommentSection = () => {
    if (!showComments) return null;

    return (
      <View style={[styles.commentsSection, { backgroundColor: theme.colors.card }]}>
        <View style={styles.commentInputWrapper}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.commentAvatar} />
          ) : (
            <View style={[styles.commentAvatarPlaceholder, { backgroundColor: theme.colors.border }]}>
              <Icon name="user" size={12} color={theme.colors.text} />
            </View>
          )}
          <View style={[styles.commentInputContainer, { backgroundColor: theme.colors.background }]}>
            <TextInput
              style={[styles.commentInput, { color: theme.colors.text }]}
              placeholder="Ajouter un commentaire..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            {newComment.trim() && (
              <TouchableOpacity
                style={[styles.sendCommentButton, { opacity: sendingComment ? 0.7 : 1 }]}
                onPress={handleSendComment}
                disabled={sendingComment}
              >
                {sendingComment ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Icon name="send" size={16} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loadingComments ? (
          <ActivityIndicator style={styles.commentsLoader} color={theme.colors.primary} />
        ) : (
          <View style={styles.commentsList}>
            {comments.map((item) => (
              <View key={item.id} style={[styles.commentItem, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.commentHeader}>
                  {item.author?.avatar ? (
                    <Image source={{ uri: item.author.avatar }} style={styles.commentAvatar} />
                  ) : (
                    <View style={[styles.commentAvatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                      <Icon name="user" size={12} color={theme.colors.text} />
                    </View>
                  )}
                  <View style={styles.commentContentWrapper}>
                    <View style={styles.commentBubble}>
                      <Text style={[styles.commentAuthor, { color: theme.colors.text }]}>
                        {item.author?.username || 'Utilisateur inconnu'}
                      </Text>
                      <Text style={[styles.commentText, { color: theme.colors.text }]}>
                        {item.content}
                      </Text>
                    </View>
                    <View style={styles.commentActions}>
                      <Text style={[styles.commentTime, { color: theme.colors.textSecondary }]}>
                        {formatDate(item.createdAt)}
                      </Text>
                      <TouchableOpacity style={styles.commentLikeButton}>
                        <Text style={[styles.commentActionText, { color: theme.colors.textSecondary }]}>J'aime</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentReplyButton}>
                        <Text style={[styles.commentActionText, { color: theme.colors.textSecondary }]}>Répondre</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            {comments.length === 0 && (
              <Text style={[styles.noComments, { color: theme.colors.textSecondary }]}>
                Soyez le premier à commenter
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }
        ]} 
        onPress={handlePostPress}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.authorInfo} onPress={() => onProfilePress(post.author)}>
            {post.author?.avatar ? (
              <Image
                source={{ uri: post.author.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                <Icon name="user" size={20} color={theme.colors.text} />
              </View>
            )}
            <View>
              <Text style={[styles.authorName, { color: theme.colors.text }]}>
                {post.author?.username || 'Utilisateur inconnu'}
              </Text>
              <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
                {formatDate(post.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
          
          {canShowConnectButton && (
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Icon name="user-plus" size={16} color={theme.colors.primary} />
              <Text style={[styles.connectText, { color: theme.colors.primary }]}>Connecter</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowOptions(true)}
          >
            <Icon name="ellipsis-h" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.content, { color: theme.colors.text }]}>
          {post.content}
        </Text>

        {renderMedia()}
        {renderSharedPost()}

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon 
              name={isLiked ? "heart" : "heart-o"} 
              size={20} 
              color={isLiked ? theme.colors.primary : theme.colors.text} 
            />
            <Text style={[
              styles.actionText, 
              { color: isLiked ? theme.colors.primary : theme.colors.text }
            ]}>
              {likesCount}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
            <Icon name="comment-o" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {post.commentsCount || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleRepost}>
            <Icon 
              name="retweet" 
              size={20} 
              color={isReposted ? theme.colors.primary : theme.colors.text} 
            />
            <Text style={[
              styles.actionText, 
              { color: isReposted ? theme.colors.primary : theme.colors.text }
            ]}>
              {repostsCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" size={20} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {post.sharesCount || 0}
            </Text>
          </TouchableOpacity>
        </View>

        {renderCommentSection()}
      </TouchableOpacity>

      <PostOptionsMenu
        isVisible={showOptions}
        onClose={() => setShowOptions(false)}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onReport={handleReport}
        onHide={handleHide}
        onFollow={handleFollow}
        isProfileOwner={isProfileOwner}
        theme={theme}
      />
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    mediaType: PropTypes.oneOf(['image', 'video', 'document', 'text']),
    mediaUrl: PropTypes.string,
    mediaMetadata: PropTypes.object,
    author: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
    likesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    sharesCount: PropTypes.number,
    repostsCount: PropTypes.number,
    likes: PropTypes.array,
    originalPost: PropTypes.object,
  }).isRequired,
  onProfilePress: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  onShare: PropTypes.func,
  onUpdate: PropTypes.func,
  isProfileOwner: PropTypes.bool,
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  mediaImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  documentName: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  documentSize: {
    fontSize: 12,
    marginTop: 2,
  },
  sharedPostContainer: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  avatarPlaceholderSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme => theme.colors.primary,
  },
  connectText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    paddingHorizontal: 12,
    minHeight: 36,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    maxHeight: 100,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCommentButton: {
    padding: 8,
  },
  commentsList: {
    paddingHorizontal: 12,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentContentWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  commentBubble: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 8,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 4,
  },
  commentTime: {
    fontSize: 12,
    marginRight: 12,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  commentLikeButton: {
    marginRight: 12,
  },
  commentReplyButton: {
    marginRight: 12,
  },
  noComments: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  commentsLoader: {
    padding: 20,
  },
});

export default PostCard;
