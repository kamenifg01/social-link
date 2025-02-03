<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useCallback } from 'react';
>>>>>>> Stashed changes
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
<<<<<<< Updated upstream
import { useTheme } from '../hooks/useTheme';
import { fetchUsers, sendConnectionRequest } from '../services/apiService';

const NetworkScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingConnections, setPendingConnections] = useState(new Set());
  const { theme } = useTheme();
=======
import { useTheme } from '../contexts/ThemeContext';
import { fetchUsers, sendConnectionRequest } from '../services/apiService';
import debounce from 'lodash/debounce';

const NetworkScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingConnections] = useState(new Set());

  const loadUsers = async (query = '') => {
    try {
      const fetchedUsers = await fetchUsers(query);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      loadUsers(query);
    }, 500),
    []
  );
>>>>>>> Stashed changes

  useEffect(() => {
    loadUsers();
  }, []);

<<<<<<< Updated upstream
  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      setPendingConnections(prev => new Set([...prev, userId]));
      await sendConnectionRequest(userId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de connexion:', error);
      setPendingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
=======
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const handleConnect = async (userId) => {
    try {
      await sendConnectionRequest(userId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de connexion:', error);
>>>>>>> Stashed changes
    }
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.connectionCard,
        { 
<<<<<<< Updated upstream
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
=======
          backgroundColor: colors.card,
          borderColor: colors.border
>>>>>>> Stashed changes
        }
      ]}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
<<<<<<< Updated upstream
      <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
          {item.title}
        </Text>
        <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
          {item.company}
        </Text>
        <Text style={[styles.mutual, { color: theme.colors.textSecondary }]}>
          {item.mutualConnections} relations en commun
        </Text>
=======
      {item.profilePicture ? (
        <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
          <Icon name="user" size={24} color={colors.text} />
        </View>
      )}
      
      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.username, { color: colors.textSecondary }]}>
          @{item.username}
        </Text>
        {item.title && (
          <Text style={[styles.title, { color: colors.textSecondary }]}>
            {item.title}
          </Text>
        )}
        {item.company && (
          <Text style={[styles.company, { color: colors.textSecondary }]}>
            {item.company}
          </Text>
        )}
        {item.mutualConnections > 0 && (
          <Text style={[styles.mutual, { color: colors.textSecondary }]}>
            {item.mutualConnections} relations en commun
          </Text>
        )}
>>>>>>> Stashed changes
      </View>

      <TouchableOpacity 
        style={[
          styles.connectButton,
          { 
<<<<<<< Updated upstream
            backgroundColor: item.isConnected ? theme.colors.surface : theme.colors.primary,
            borderColor: item.isConnected ? theme.colors.border : theme.colors.primary
          }
        ]}
      >
        <Icon 
          name={item.isConnected ? "check" : "user-plus"} 
          size={16} 
          color={item.isConnected ? theme.colors.textSecondary : '#fff'} 
=======
            backgroundColor: item.isConnected ? colors.surface : colors.primary,
            borderColor: item.isConnected ? colors.border : colors.primary
          }
        ]}
        onPress={() => !item.isConnected && handleConnect(item.id)}
        disabled={item.isConnected || pendingConnections.has(item.id)}
      >
        <Icon 
          name={item.isConnected ? "check" : pendingConnections.has(item.id) ? "clock-o" : "user-plus"} 
          size={16} 
          color={item.isConnected ? colors.textSecondary : '#fff'} 
>>>>>>> Stashed changes
        />
        <Text 
          style={[
            styles.connectButtonText,
<<<<<<< Updated upstream
            { color: item.isConnected ? theme.colors.textSecondary : '#fff' }
          ]}
        >
          {item.isConnected ? 'Connecté' : 'Se connecter'}
=======
            { color: item.isConnected ? colors.textSecondary : '#fff' }
          ]}
        >
          {item.isConnected ? 'Connecté' : pendingConnections.has(item.id) ? 'En attente' : 'Se connecter'}
>>>>>>> Stashed changes
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
<<<<<<< Updated upstream
    <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
=======
    <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
>>>>>>> Stashed changes
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => navigation.navigate('Connections')}
      >
<<<<<<< Updated upstream
        <Text style={[styles.statNumber, { color: theme.colors.text }]}>412</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
=======
        <Text style={[styles.statNumber, { color: colors.text }]}>412</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
          Relations
        </Text>
      </TouchableOpacity>

<<<<<<< Updated upstream
      <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
=======
      <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
>>>>>>> Stashed changes

      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => navigation.navigate('NetworkGrowth')}
      >
<<<<<<< Updated upstream
        <Text style={[styles.statNumber, { color: theme.colors.text }]}>28</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
=======
        <Text style={[styles.statNumber, { color: colors.text }]}>28</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
          Ce mois
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
<<<<<<< Updated upstream
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
=======
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
>>>>>>> Stashed changes
      </View>
    );
  }

  return (
<<<<<<< Updated upstream
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Icon name="search" size={20} color={theme.colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Rechercher des contacts..."
          placeholderTextColor={theme.colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={users.filter(user => 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.title && user.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()))
        )}
=======
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={users}
>>>>>>> Stashed changes
        renderItem={renderUserCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
<<<<<<< Updated upstream
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Aucun utilisateur trouvé
=======
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery ? 'Aucun utilisateur trouvé' : 'Commencez à chercher des contacts'}
>>>>>>> Stashed changes
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
<<<<<<< Updated upstream
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
=======
  listContainer: {
    padding: 15,
>>>>>>> Stashed changes
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  connectionCard: {
    flexDirection: 'row',
<<<<<<< Updated upstream
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
=======
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
>>>>>>> Stashed changes
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
<<<<<<< Updated upstream
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
=======
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
>>>>>>> Stashed changes
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
<<<<<<< Updated upstream
    marginBottom: 4,
  },
  mutual: {
    fontSize: 12,
=======
    marginBottom: 2,
  },
  mutual: {
    fontSize: 12,
    marginTop: 4,
>>>>>>> Stashed changes
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< Updated upstream
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  connectButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
=======
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 10,
    alignSelf: 'center',
  },
  connectButtonText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
>>>>>>> Stashed changes
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NetworkScreen; 