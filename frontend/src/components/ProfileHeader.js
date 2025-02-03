import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.container}>
      <Avatar uri={user.avatar} size={80} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileHeader; 