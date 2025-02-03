import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../hooks/useTheme';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  
  const notifications = [
    {
      id: '1',
      type: 'like',
      user: 'Marie Dupont',
      content: 'a aimé votre publication',
      time: 'Il y a 5 min',
      read: false,
    },
    {
      id: '2',
      type: 'comment',
      user: 'Jean Martin',
      content: 'a commenté votre publication',
      time: 'Il y a 15 min',
      read: true,
    },
    // Ajoutez d'autres notifications ici
  ];

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        { 
          backgroundColor: item.read ? theme.colors.card : theme.colors.surface,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon 
          name={item.type === 'like' ? 'heart' : 'comment'} 
          size={24} 
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {item.user}
        </Text>
        <Text style={[styles.content, { color: theme.colors.textSecondary }]}>
          {item.content}
        </Text>
        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
          {item.time}
        </Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});

export default NotificationsScreen; 