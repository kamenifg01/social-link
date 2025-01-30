import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addComment } from '../redux/postSlice';
import { createComment } from '../services/apiService';

const AddComment = ({ postId }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleAddComment = async () => {
    try {
      await createComment(postId, { content });
      Alert.alert('Succès', 'Commentaire ajouté avec succès !');
      setContent('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error.message);
      Alert.alert('Erreur', 'Échec de l\'ajout du commentaire');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ajouter un commentaire..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title="Ajouter" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default AddComment; 