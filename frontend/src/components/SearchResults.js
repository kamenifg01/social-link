import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';

const SearchResults = ({ results, onUserPress, onPostPress, loading, query }) => {
  const { colors } = useTheme();

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.userItem, { backgroundColor: colors.card }]}
      onPress={() => onUserPress(item)}
    >
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
          <Icon name="user" size={20} color={colors.text} />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={[styles.username, { color: colors.text }]}>
          {item.username}
        </Text>
        {item.title && (
          <Text style={[styles.userTitle, { color: colors.text }]}>
            {item.title}
          </Text>
        )}
        {item.company && (
          <Text style={[styles.userCompany, { color: colors.textSecondary }]}>
            {item.company}
          </Text>
        )}
      </View>
      <Icon name="chevron-right" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.postItem, { backgroundColor: colors.card }]}
      onPress={() => onPostPress(item)}
    >
      <View style={styles.postHeader}>
        {item.author?.avatar ? (
          <Image source={{ uri: item.author.avatar }} style={styles.smallAvatar} />
        ) : (
          <View style={[styles.smallAvatarPlaceholder, { backgroundColor: colors.border }]}>
            <Icon name="user" size={12} color={colors.text} />
          </View>
        )}
        <Text style={[styles.authorName, { color: colors.text }]}>
          {item.author?.username || 'Utilisateur inconnu'}
        </Text>
      </View>
      <Text 
        style={[styles.postContent, { color: colors.text }]}
        numberOfLines={2}
      >
        {item.content}
      </Text>
      {item.mediaUrl && (
        <View style={styles.postMediaIndicator}>
          <Icon 
            name={item.mediaType === 'image' ? 'image' : 'play-circle'} 
            size={14} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.mediaText, { color: colors.textSecondary }]}>
            {item.mediaType === 'image' ? 'Image' : 'Vidéo'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={{ color: colors.text }}>Recherche en cours...</Text>
      </View>
    );
  }

  if (results.length === 0 && query) {
    return (
      <View style={styles.messageContainer}>
        <Text style={{ color: colors.text }}>Aucun résultat trouvé pour "{query}"</Text>
      </View>
    );
  }

  const users = results.filter(item => item.type === 'user');
  const posts = results.filter(item => item.type === 'post');

  return (
    <FlatList
      data={[
        { type: 'header', title: 'Personnes', data: users },
        { type: 'header', title: 'Publications', data: posts }
      ]}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          if (item.data.length === 0) return null;
          return (
            <>
              <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <FlatList
                data={item.data}
                renderItem={item.title === 'Personnes' ? renderUserItem : renderPostItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                scrollEnabled={false}
              />
            </>
          );
        }
        return null;
      }}
      keyExtractor={(item, index) => `section-${index}`}
    />
  );
};

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['user', 'post']).isRequired,
    username: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    avatar: PropTypes.string,
    content: PropTypes.string,
    mediaUrl: PropTypes.string,
    mediaType: PropTypes.string,
    author: PropTypes.object,
  })).isRequired,
  onUserPress: PropTypes.func.isRequired,
  onPostPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  query: PropTypes.string,
};

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  userTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  userCompany: {
    fontSize: 14,
    marginTop: 2,
  },
  postItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  smallAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  postMediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  mediaText: {
    marginLeft: 5,
    fontSize: 12,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SearchResults; 