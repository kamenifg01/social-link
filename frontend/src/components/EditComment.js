import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateComment } from '../redux/postSlice';

const EditComment = ({ postId, commentId, initialContent, onCancel }) => {
  const [content, setContent] = useState(initialContent);
  const dispatch = useDispatch();

  const handleUpdateComment = () => {
    dispatch(updateComment({ postId, commentId, content }));
    onCancel();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Modifier le commentaire..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title="Mettre à jour" onPress={handleUpdateComment} />
      <Button title="Annuler" onPress={onCancel} color="red" />
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

export default EditComment; 