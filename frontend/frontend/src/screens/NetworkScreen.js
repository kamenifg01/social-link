import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../hooks/useTheme';
import { fetchUsers, sendConnectionRequest } from '../services/apiService';

const NetworkScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingConnections, setPendingConnections] = useState(new Set());
  const { theme } = useTheme();

  useEffect(() => {
    loadUsers();
  }, []);

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
    }
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.connectionCard,
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
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
      </View>

      <TouchableOpacity 
        style={[
          styles.connectButton,
          { 
            backgroundColor: item.isConnected ? theme.colors.surface : theme.colors.primary,
            borderColor: item.isConnected ? theme.colors.border : theme.colors.primary
          }
        ]}
      >
        <Icon 
          name={item.isConnected ? "check" : "user-plus"} 
          size={16} 
          color={item.isConnected ? theme.colors.textSecondary : '#fff'} 
        />
        <Text 
          style={[
            styles.connectButtonText,
            { color: item.isConnected ? theme.colors.textSecondary : '#fff' }
          ]}
        >
          {item.isConnected ? 'Connecté' : 'Se connecter'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => navigation.navigate('Connections')}
      >
        <Text style={[styles.statNumber, { color: theme.colors.text }]}>412</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Relations
        </Text>
      </TouchableOpacity>

      <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => navigation.navigate('NetworkGrowth')}
      >
        <Text style={[styles.statNumber, { color: theme.colors.text }]}>28</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
          Ce mois
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
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
        renderItem={renderUserCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              Aucun utilisateur trouvé
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    marginBottom: 4,
  },
  mutual: {
    fontSize: 12,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NetworkScreen; 