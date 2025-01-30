import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import InputField from './InputField';

const CommentSection = ({ comments, onAddComment }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.author}>{item.author}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <InputField
        placeholder="Ajouter un commentaire..."
        onSubmitEditing={(event) => onAddComment(event.nativeEvent.text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  comment: {
    marginBottom: 10,
  },
  author: {
    fontWeight: 'bold',
  },
});

export default CommentSection; 