import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
<<<<<<< Updated upstream
import { useTheme } from '../hooks/useTheme';

const NotificationsScreen = () => {
  const { theme } = useTheme();
=======
import { useTheme } from '../contexts/ThemeContext';

const NotificationsScreen = () => {
  const { colors } = useTheme();
>>>>>>> Stashed changes
  
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
<<<<<<< Updated upstream
          backgroundColor: item.read ? theme.colors.card : theme.colors.surface,
          borderColor: theme.colors.border
=======
          backgroundColor: item.read ? colors.card : colors.surface,
          borderColor: colors.border
>>>>>>> Stashed changes
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon 
          name={item.type === 'like' ? 'heart' : 'comment'} 
          size={24} 
<<<<<<< Updated upstream
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
=======
          color={colors.primary}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {item.user}
        </Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          {item.content}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
          {item.time}
        </Text>
      </View>
      {!item.read && (
<<<<<<< Updated upstream
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
=======
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
>>>>>>> Stashed changes
      )}
    </TouchableOpacity>
  );

  return (
<<<<<<< Updated upstream
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
=======
    <View style={[styles.container, { backgroundColor: colors.background }]}>
>>>>>>> Stashed changes
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