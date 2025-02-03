import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { removeComment } from '../redux/postSlice';
import EditComment from './EditComment';

const CommentCard = ({ postId, comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeComment({ postId, commentId: comment.id }));
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <EditComment
          postId={postId}
          commentId={comment.id}
          initialContent={comment.content}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <Text style={styles.content}>{comment.content}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Modifier" onPress={() => setIsEditing(true)} />
            <Button title="Supprimer" onPress={handleDelete} color="red" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CommentCard;
