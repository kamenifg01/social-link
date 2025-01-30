import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { fetchProfile, fetchUserPosts } from '../services/apiService';
import PostCard from '../components/PostCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../navigation/AppNavigator';
import { useTheme } from '@react-navigation/native';

const ProfileScreen = ({ route, navigation }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { colors } = useTheme();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await fetchProfile();
      if (profileData) {
        setProfile(profileData);
        const userPosts = await fetchUserPosts(profileData.id);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleProfilePress = (userProfile) => {
    if (userProfile?.id !== profile?.id) {
      navigation.navigate('Profile', { userId: userProfile.id });
    }
  };

  const handleShare = () => {
    // Implémentation du partage
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile });
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const handleShowConnections = () => {
    if (profile?.connections > 0) {
      setShowConnectionsModal(true);
    } else {
      navigation.navigate('Network');
    }
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={handleCreatePost}
      >
        <Icon name="pencil" size={16} color={colors.background} style={styles.actionIcon} />
        <Text style={[styles.actionButtonText, { color: colors.background }]}>Créer une publication</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={handleEditProfile}
      >
        <Icon name="edit" size={16} color={colors.background} style={styles.actionIcon} />
        <Text style={[styles.actionButtonText, { color: colors.background }]}>Modifier le profil</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConnectionsModal = () => (
    <Modal
      visible={showConnectionsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowConnectionsModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Relations</Text>
            <TouchableOpacity onPress={() => setShowConnectionsModal(false)}>
              <Icon name="times" size={20} color={isDarkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={[]} // À remplacer par la vraie liste des relations
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.connectionItem, { borderBottomColor: isDarkMode ? '#444' : '#e1e1e1' }]}
                onPress={() => {
                  setShowConnectionsModal(false);
                  navigation.navigate('Profile', { userId: item.id });
                }}
              >
                {item.profilePicture ? (
                  <Image source={{ uri: item.profilePicture }} style={styles.connectionAvatar} />
                ) : (
                  <Icon name="user-circle" size={40} color="#0073b1" />
                )}
                <View style={styles.connectionInfo}>
                  <Text style={[styles.connectionName, { color: isDarkMode ? '#fff' : '#000' }]}>{item.username}</Text>
                  <Text style={[styles.connectionTitle, { color: isDarkMode ? '#ccc' : '#666' }]}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={styles.emptyConnections}>
                <Text style={[styles.emptyConnectionsText, { color: isDarkMode ? '#fff' : '#666' }]}>
                  Commencez à développer votre réseau professionnel
                </Text>
                <TouchableOpacity 
                  style={[styles.findConnectionsButton, { backgroundColor: '#0073b1' }]}
                  onPress={() => {
                    setShowConnectionsModal(false);
                    navigation.navigate('Network');
                  }}
                >
                  <Text style={styles.findConnectionsButtonText}>Trouver des relations</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderStats = () => (
    <View style={[styles.statsContainer, { borderTopColor: isDarkMode ? '#444' : '#e1e1e1' }]}>
      <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('PostList', { userId: profile?.id })}>
        <Text style={[styles.statNumber, { color: colors.text }]}>{posts.length}</Text>
        <Text style={[styles.statLabel, { color: colors.text }]}>Publications</Text>
      </TouchableOpacity>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.text }]}>{profile?.views || 0}</Text>
        <Text style={[styles.statLabel, { color: colors.text }]}>Vues du profil</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
        <View style={styles.profileHeader}>
          {profile?.profilePicture ? (
            <Image
              source={{ uri: profile.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Icon name="user" size={40} color={colors.text} />
            </View>
          )}
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('Info', 'Fonctionnalité à venir')}
          >
            <Icon name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>
          {profile?.username || 'Utilisateur'}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {profile?.title || 'Titre professionnel'}
        </Text>
        <Text style={[styles.location, { color: colors.text }]}>
          {profile?.location || 'Localisation'} • 
          <Text style={styles.connections}> {profile?.connections || 0} relations</Text>
        </Text>

        {renderActionButtons()}
        {renderStats()}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>À propos</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          {profile?.location && (
            <View style={styles.infoItem}>
              <Icon name="map-marker" size={20} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.text }]}>{profile.location}</Text>
            </View>
          )}
          {profile?.website && (
            <View style={styles.infoItem}>
              <Icon name="link" size={20} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.text }]}>{profile.website}</Text>
            </View>
          )}
          {profile?.joinDate && (
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Membre depuis {profile.joinDate}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.sectionHeader, { borderTopColor: isDarkMode ? '#444' : '#e1e1e1' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Publications</Text>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            navigation={navigation}
            onProfilePress={handleProfilePress}
            onShare={handleShare}
            onUpdate={onRefresh}
            isProfileOwner={true}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0073b1']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Aucune publication pour le moment
            </Text>
          </View>
        }
      />
      {showConnectionsModal && renderConnectionsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoCard: {
    padding: 15,
    borderRadius: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  connectionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  connectionInfo: {
    marginLeft: 15,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  connectionTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyConnections: {
    padding: 20,
    alignItems: 'center',
  },
  emptyConnectionsText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  findConnectionsButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  findConnectionsButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    flex: 0.48,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  profileSection: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  profileHeader: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    right: '30%',
    bottom: 0,
    backgroundColor: '#0073b1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  connections: {
    color: '#0073b1',
    fontWeight: '500',
  },
});

export default ProfileScreen; 