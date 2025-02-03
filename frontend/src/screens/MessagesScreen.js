import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../hooks/useTheme';

const MessagesScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const messages = [
    {
      id: '1',
      user: {
        name: 'Marie Dupont',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        online: true,
      },
      lastMessage: 'Bonjour, comment allez-vous ?',
      time: '10:30',
      unread: 2,
    },
    {
      id: '2',
      user: {
        name: 'Jean Martin',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        online: false,
      },
      lastMessage: 'Merci pour votre aide !',
      time: 'Hier',
      unread: 0,
    },
    // Ajoutez d'autres messages ici
  ];

  const renderMessage = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.messageItem,
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
      onPress={() => navigation.navigate('ChatScreen', { user: item.user })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.online && (
          <View style={[styles.onlineIndicator, { backgroundColor: theme.colors.success }]} />
        )}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {item.user.name}
          </Text>
          <Text style={[styles.messageTime, { color: theme.colors.textSecondary }]}>
            {item.time}
          </Text>
        </View>

        <View style={styles.messageFooter}>
          <Text 
            style={[
              styles.lastMessage,
              { color: theme.colors.textSecondary },
              item.unread > 0 && { color: theme.colors.text, fontWeight: '600' }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity 
        style={[styles.newMessageButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('NewMessage')}
      >
        <Icon name="edit" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  newMessageButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MessagesScreen; 