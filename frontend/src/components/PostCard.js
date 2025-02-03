import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking, Alert, Share, TextInput, ActivityIndicator, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
<<<<<<< Updated upstream
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
=======
import { useTheme } from '../contexts/ThemeContext';
import { Video } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';
import { API_URL, getMediaUrl } from '../config/api';
import { useAuth } from '../hooks/useAuth';
import PostOptionsMenu from './PostOptionsMenu';
import { likePost, unlikePost, repostPost, unrepostPost, sharePost, createComment, fetchComments, getPostReactions } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MediaViewer from './MediaViewer';

const getReactionIcon = (type) => {
  switch (type) {
    case 'like': return '👍';
    case 'heart': return '❤️';
    case 'laugh': return '😄';
    case 'wow': return '😮';
    case 'sad': return '😢';
    case 'angry': return '😠';
    default: return '👍';
  }
};

const PostCard = ({ post, onProfilePress, navigation, onShare, onUpdate, isProfileOwner }) => {
  const { colors } = useTheme();
  const { user, token, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
>>>>>>> Stashed changes
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isReposted, setIsReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
<<<<<<< Updated upstream
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
=======
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [currentReaction, setCurrentReaction] = useState('like');
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const reactionTypes = [
    { type: 'like', emoji: '👍' },
    { type: 'heart', emoji: '❤️' },
    { type: 'laugh', emoji: '😄' },
    { type: 'wow', emoji: '😮' },
    { type: 'sad', emoji: '😢' },
    { type: 'angry', emoji: '😠' }
  ];
  
  const [reactions, setReactions] = useState({
    like: [],
    heart: [],
    laugh: [],
    wow: [],
    sad: [],
    angry: []
  });
  const [mediaError, setMediaError] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);

  const ReactionButton = ({ type, count, isSelected, onPress }) => {
    return (
      <TouchableOpacity
        style={[
          styles.reactionButton,
          isSelected && { backgroundColor: colors.primary + '20' }
        ]}
        onPress={onPress}
      >
        <Text style={styles.reactionEmoji}>{getReactionIcon(type)}</Text>
        {count > 0 && (
          <Text style={[styles.reactionCount, { color: colors.text }]}>
            {count}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
>>>>>>> Stashed changes

  // Mettre à jour l'état des likes et reposts quand l'utilisateur change
  useEffect(() => {
    if (user && post) {
      setIsLiked(post.likes?.some(like => like.userId === user.id) || false);
      setIsReposted(post.reposts?.some(repost => repost.userId === user.id) || false);
    }
  }, [user, post]);

<<<<<<< Updated upstream
=======
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await getPostReactions(post.id);
        setReactions(response.reactions);
        if (response.currentUserReaction) {
          setCurrentReaction(response.currentUserReaction);
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Erreur chargement réactions:', error);
      }
    };

    fetchReactions();
  }, [post.id]);

  // Vérifier si le post est masqué
  useEffect(() => {
    const checkHiddenStatus = async () => {
      try {
        const hiddenPosts = await AsyncStorage.getItem('hiddenPosts');
        const hiddenPostsArray = hiddenPosts ? JSON.parse(hiddenPosts) : [];
        setIsHidden(hiddenPostsArray.includes(post.id));
      } catch (error) {
        console.error('Erreur lors de la vérification du statut masqué:', error);
      }
    };
    checkHiddenStatus();
  }, [post.id]);

>>>>>>> Stashed changes
  // Vérification si on doit afficher le bouton de connexion
  const canShowConnectButton = !isProfileOwner && !post.originalPost && user?.id;

  console.log('Post options check:', {
    userId: user?.id,
    isProfileOwner,
    canShowConnect: canShowConnectButton
  });

<<<<<<< Updated upstream
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
=======
  const formattedDate = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: fr
  }) : '';

  // Ajouter dans useEffect pour vérifier si on suit déjà l'utilisateur
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${post.author.id}/follow-status`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Erreur vérification statut suivi:', error);
      }
    };
    if (user && post.author.id !== user.id) {
      checkFollowStatus();
    }
  }, [user, post.author.id]);

  const handleReaction = async (reactionType) => {
    try {
      console.log('Ajout réaction:', reactionType);
      
      // Retirer l'ancienne réaction si elle existe
      if (isLiked) {
        await unlikePost(post.id);
      }
      
      // Ajouter la nouvelle réaction
      const response = await likePost(post.id, { reactionType });
      console.log('Réponse réaction:', response);
      
      setIsLiked(true);
      setCurrentReaction(reactionType);
      
      // Mettre à jour les réactions
      const updatedReactions = { ...reactions };
      
      // Retirer l'ancienne réaction de l'utilisateur
      Object.keys(updatedReactions).forEach(type => {
        updatedReactions[type] = updatedReactions[type].filter(
          u => u.userId !== user.id
        );
      });
      
      // Ajouter la nouvelle réaction
      updatedReactions[reactionType].push({
        userId: user.id,
        username: user.username,
        profilePicture: user.profilePicture
      });
      
      setReactions(updatedReactions);
      
      if (onUpdate) {
        onUpdate();
      }
      
      setShowReactionMenu(false);
    } catch (error) {
      console.error('Erreur réaction:', error);
      Alert.alert('Erreur', 'Impossible de réagir au post');
    }
>>>>>>> Stashed changes
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
<<<<<<< Updated upstream
      console.log('Utilisateur non authentifié pour like');
=======
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour aimer ce post',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
>>>>>>> Stashed changes
      return;
    }

    try {
<<<<<<< Updated upstream
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
=======
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setCurrentReaction('like');
        
        // Mettre à jour les réactions
        const updatedReactions = { ...reactions };
        Object.keys(updatedReactions).forEach(type => {
          updatedReactions[type] = updatedReactions[type].filter(
            u => u.userId !== user.id
          );
        });
        setReactions(updatedReactions);
      } else {
        await handleReaction('like');
      }
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur like:', error);
      Alert.alert('Erreur', 'Impossible de gérer le like');
    }
  };

  const handleRepost = async () => {
    if (!isAuthenticated()) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour republier ce post',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
      return;
    }

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      Alert.alert("Erreur", "Impossible de gérer le repost");
=======
      Alert.alert("Erreur", "Impossible de republier le post");
>>>>>>> Stashed changes
    }
  };

  const handleShare = async () => {
    try {
<<<<<<< Updated upstream
      const result = await Share.share({
        message: `${post.content}\n\nPartagé depuis Social Link`,
=======
      const postUrl = `${API_URL}/posts/${post.id}`;
      const result = await Share.share({
        message: `${post.content}\n\nConsulter ce post sur Social Link: ${postUrl}`,
        url: postUrl,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    setShowComments(!showComments);
=======
    navigation.navigate('PostDetails', { postId: post.id });
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    Alert.alert("Info", "Cette publication ne s'affichera plus");
=======
    // Vérifier si le post contient un média (image ou vidéo)
    if (!post.mediaType || !['image', 'video'].includes(post.mediaType)) {
      Alert.alert("Info", "Cette option n'est disponible que pour les publications contenant des images ou des vidéos.");
      return;
    }

    // Stocker l'ID du post dans AsyncStorage pour le masquer
    try {
      const storeHiddenPost = async () => {
        const hiddenPosts = await AsyncStorage.getItem('hiddenPosts');
        const hiddenPostsArray = hiddenPosts ? JSON.parse(hiddenPosts) : [];
        if (!hiddenPostsArray.includes(post.id)) {
          hiddenPostsArray.push(post.id);
          await AsyncStorage.setItem('hiddenPosts', JSON.stringify(hiddenPostsArray));
        }
      };
      storeHiddenPost();
      Alert.alert("Info", "Cette publication ne s'affichera plus");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur lors du masquage du post:', error);
      Alert.alert("Erreur", "Impossible de masquer la publication");
    }
>>>>>>> Stashed changes
    setShowOptions(false);
  };

  const handleFollow = async () => {
    try {
<<<<<<< Updated upstream
      await axios.post(`${API_URL}/users/${post.author.id}/follow`);
      Alert.alert("Succès", "Vous suivez maintenant cet utilisateur");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de suivre cet utilisateur");
=======
      if (isFollowing) {
        await axios.delete(`${API_URL}/users/${post.author.id}/follow`);
        Alert.alert("Succès", "Vous ne suivez plus cet utilisateur");
        setIsFollowing(false);
      } else {
        await axios.post(`${API_URL}/users/${post.author.id}/follow`);
        Alert.alert("Succès", "Vous suivez maintenant cet utilisateur");
        setIsFollowing(true);
      }
    } catch (error) {
      Alert.alert("Erreur", isFollowing ? 
        "Impossible de ne plus suivre cet utilisateur" : 
        "Impossible de suivre cet utilisateur"
      );
>>>>>>> Stashed changes
    }
    setShowOptions(false);
  };

<<<<<<< Updated upstream
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
=======
  const handleMediaPress = () => {
    if (post.mediaType === 'image' || post.mediaType === 'video') {
      setShowMediaViewer(true);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    const mediaUrl = getMediaUrl(post.mediaUrl);
    if (!mediaUrl) return null;

    const handleMediaLoadError = () => {
      console.error('Erreur de chargement du média:', mediaUrl);
      setMediaError(true);
      setMediaLoading(false);
    };

    const handleMediaLoadSuccess = () => {
      setMediaError(false);
      setMediaLoading(false);
    };

    switch (post.mediaType) {
      case 'image':
        return (
          <TouchableOpacity 
            style={styles.mediaContainer}
            onPress={handleMediaPress}
          >
            {mediaLoading && (
              <View style={styles.mediaLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {mediaError ? (
              <View style={styles.mediaErrorContainer}>
                <Icon name="exclamation-circle" size={40} color={colors.error} />
                <Text style={[styles.mediaErrorText, { color: colors.error }]}>
                  Impossible de charger l'image
                </Text>
              </View>
            ) : (
              <Image
                source={{ uri: mediaUrl }}
                style={styles.media}
                onError={handleMediaLoadError}
                onLoad={handleMediaLoadSuccess}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
>>>>>>> Stashed changes
        );
      case 'video':
        return (
          <TouchableOpacity 
<<<<<<< Updated upstream
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
=======
            style={styles.mediaContainer}
            onPress={handleMediaPress}
          >
            {mediaLoading && (
              <View style={styles.mediaLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {mediaError ? (
              <View style={styles.mediaErrorContainer}>
                <Icon name="exclamation-circle" size={40} color={colors.error} />
                <Text style={[styles.mediaErrorText, { color: colors.error }]}>
                  Impossible de charger la vidéo
                </Text>
              </View>
            ) : (
              <Video
                source={{ uri: mediaUrl }}
                style={styles.media}
                useNativeControls
                resizeMode="contain"
                isLooping={false}
                onError={handleMediaLoadError}
                onLoad={handleMediaLoadSuccess}
                shouldPlay={isPlaying}
              />
            )}
          </TouchableOpacity>
        );
>>>>>>> Stashed changes
      default:
        return null;
    }
  };

  const renderSharedPost = () => {
    if (post.originalPost) {
      return (
<<<<<<< Updated upstream
        <View style={[styles.sharedPostContainer, { backgroundColor: theme.colors.surface }]}>
=======
        <View style={[styles.sharedPostContainer, { backgroundColor: colors.surface }]}>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <View style={[styles.avatarPlaceholderSmall, { backgroundColor: theme.colors.border }]}>
                  <Icon name="user" size={16} color={theme.colors.text} />
                </View>
              )}
              <Text style={[styles.authorName, { color: theme.colors.text }]}>
=======
                <View style={[styles.avatarPlaceholderSmall, { backgroundColor: colors.border }]}>
                  <Icon name="user" size={16} color={colors.text} />
                </View>
              )}
              <Text style={[styles.authorName, { color: colors.text }]}>
>>>>>>> Stashed changes
                {post.originalPost.author?.username || 'Utilisateur inconnu'}
              </Text>
            </TouchableOpacity>
          </View>
<<<<<<< Updated upstream
          <Text style={[styles.content, { color: theme.colors.text }]}>
=======
          <Text style={[styles.content, { color: colors.text }]}>
>>>>>>> Stashed changes
            {post.originalPost.content}
          </Text>
          {post.originalPost.mediaUrl && renderMedia()}
        </View>
      );
    }
    return null;
  };

<<<<<<< Updated upstream
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
=======
  const handleLongPressLike = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour réagir à ce post',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
      return;
    }
    setShowReactionMenu(true);
  };

  const getTotalReactions = () => {
    return Object.values(reactions).reduce((total, users) => total + users.length, 0);
  };

  const getReactionsSummary = () => {
    const summary = [];
    Object.entries(reactions).forEach(([type, users]) => {
      if (users.length > 0) {
        summary.push({
          type,
          count: users.length,
          emoji: getReactionIcon(type)
        });
      }
    });
    return summary.sort((a, b) => b.count - a.count);
  };

  const handleOptionsPress = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter pour accéder à ces options',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
      return;
    }
    setShowOptions(true);
  };

  const handleCopyLink = async () => {
    try {
      const postUrl = `${API_URL}/posts/${post.id}`;
      await Share.share({
        message: `Découvrez cette publication : ${postUrl}`,
        url: postUrl
      });
    } catch (error) {
      console.error('Erreur partage:', error);
      Alert.alert('Erreur', 'Impossible de partager la publication');
    }
    setShowOptions(false);
  };

  // Ajouter cette fonction pour gérer les clics à l'extérieur
  const handleOutsideClick = () => {
    if (showReactionMenu) {
      setShowReactionMenu(false);
    }
  };

  // Ne pas rendre le composant si le post est masqué
  if (isHidden) {
    return null;
  }

  // Ajouter un useEffect pour gérer la fermeture du menu des réactions
  useEffect(() => {
    if (showReactionMenu) {
      const timer = setTimeout(() => {
        setShowReactionMenu(false);
      }, 5000); // Ferme automatiquement après 5 secondes si aucune action

      return () => clearTimeout(timer);
    }
  }, [showReactionMenu]);

  const ReactionMenu = () => (
    <View style={[styles.reactionMenu, { backgroundColor: colors.card }]}>
      {reactionTypes.map((reaction) => (
        <TouchableOpacity
          key={reaction.type}
          style={styles.reactionMenuItem}
          onPress={() => {
            handleReaction(reaction.type);
            setShowReactionMenu(false);
          }}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleOutsideClick}>
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]} 
>>>>>>> Stashed changes
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.authorInfo} onPress={() => onProfilePress(post.author)}>
            {post.author?.avatar ? (
              <Image
                source={{ uri: post.author.avatar }}
                style={styles.avatar}
              />
            ) : (
<<<<<<< Updated upstream
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
=======
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
                <Icon name="user" size={20} color={colors.text} />
              </View>
            )}
            <View>
              <Text style={[styles.authorName, { color: colors.text }]}>
                {post.author?.username || 'Utilisateur inconnu'}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                {formattedDate}
>>>>>>> Stashed changes
              </Text>
            </View>
          </TouchableOpacity>
          
          {canShowConnectButton && (
<<<<<<< Updated upstream
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Icon name="user-plus" size={16} color={theme.colors.primary} />
              <Text style={[styles.connectText, { color: theme.colors.primary }]}>Connecter</Text>
=======
            <TouchableOpacity 
              style={styles.connectButton(colors)} 
              onPress={handleConnect}
            >
              <Icon name="user-plus" size={16} color={colors.primary} />
              <Text style={[styles.connectText, { color: colors.primary }]}>Connecter</Text>
>>>>>>> Stashed changes
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.moreButton}
<<<<<<< Updated upstream
            onPress={() => setShowOptions(true)}
          >
            <Icon name="ellipsis-h" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.content, { color: theme.colors.text }]}>
=======
            onPress={handleOptionsPress}
          >
            <Icon name="ellipsis-h" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.content, { color: colors.text }]}>
>>>>>>> Stashed changes
          {post.content}
        </Text>

        {renderMedia()}
        {renderSharedPost()}

<<<<<<< Updated upstream
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
=======
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              onLongPress={handleLongPressLike}
              delayLongPress={300}
            >
              <Text style={styles.reactionEmoji}>
                {getReactionIcon(currentReaction)}
              </Text>
              <Text style={[styles.actionText, { color: isLiked ? colors.primary : colors.text }]}>
                {getTotalReactions()}
              </Text>
            </TouchableOpacity>

            {showReactionMenu && <ReactionMenu />}

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Comments', { postId: post.id })}
            >
              <Icon name="comment" size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {post.commentsCount || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRepost}
            >
              <Icon 
                name="retweet" 
                size={20} 
                color={isReposted ? colors.primary : colors.text} 
              />
              <Text style={[styles.actionText, { color: isReposted ? colors.primary : colors.text }]}>
                {repostsCount || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Icon name="share" size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {post.sharesCount || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
>>>>>>> Stashed changes

      <PostOptionsMenu
        isVisible={showOptions}
        onClose={() => setShowOptions(false)}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onReport={handleReport}
        onHide={handleHide}
        onFollow={handleFollow}
<<<<<<< Updated upstream
        isProfileOwner={isProfileOwner}
        theme={theme}
      />
    </>
=======
        onShare={handleShare}
        onCopyLink={handleCopyLink}
        isProfileOwner={isProfileOwner}
        isFollowing={isFollowing}
        theme={colors}
        hasMedia={post?.mediaType && ['image', 'video'].includes(post.mediaType)}
      />

      <MediaViewer
        isVisible={showMediaViewer}
        mediaUrl={getMediaUrl(post.mediaUrl)}
        mediaType={post.mediaType}
        onClose={() => setShowMediaViewer(false)}
      />
    </TouchableOpacity>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  mediaImage: {
=======
  mediaContainer: {
>>>>>>> Stashed changes
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
<<<<<<< Updated upstream
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
=======
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    marginTop: 10,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
>>>>>>> Stashed changes
  documentInfo: {
    flex: 1,
    marginLeft: 10,
  },
<<<<<<< Updated upstream
=======
  documentName: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  connectButton: {
=======
  connectButton: (colors) => ({
>>>>>>> Stashed changes
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
<<<<<<< Updated upstream
    borderColor: theme => theme.colors.primary,
  },
=======
    borderColor: colors.primary,
  }),
>>>>>>> Stashed changes
  connectText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
<<<<<<< Updated upstream
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
=======
  reactionMenu: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    flexDirection: 'row',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  reactionMenuItem: {
    padding: 8,
    marginHorizontal: 4,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  mediaLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  mediaErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  mediaErrorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
>>>>>>> Stashed changes
  },
});

export default PostCard;
