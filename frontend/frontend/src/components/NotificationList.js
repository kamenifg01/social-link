import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NotificationList = ({ notifications }) => {
  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.notification}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.message}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  notification: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default NotificationList; 