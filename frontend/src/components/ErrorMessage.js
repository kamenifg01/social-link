import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    marginVertical: 10,
  },
  text: {
    color: '#721c24',
    fontSize: 14,
  },
});

export default ErrorMessage; 