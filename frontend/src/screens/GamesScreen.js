import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GamesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Jeux (Bientôt disponible)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2ef',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default GamesScreen; 