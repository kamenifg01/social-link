<<<<<<< Updated upstream
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recherche (Bientôt disponible)</Text>
=======
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SearchResults from '../components/SearchResults';
import { searchUsers, searchPosts } from '../services/searchService';

const SearchScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = route?.params?.query || '';

  useEffect(() => {
    if (!navigation) {
      console.error('Navigation object is not available');
      setError('Une erreur de navigation est survenue');
      return;
    }

    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const [users, posts] = await Promise.all([
          searchUsers(query),
          searchPosts(query)
        ]);

        const formattedResults = [
          ...users.map(user => ({ ...user, type: 'user' })),
          ...posts.map(post => ({ ...post, type: 'post' }))
        ];

        setResults(formattedResults);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, navigation]);

  const handleUserPress = (user) => {
    if (!navigation) {
      console.error('Navigation object is not available');
      return;
    }
    if (user && user.id) {
      navigation.navigate('Profile', { userId: user.id });
    }
  };

  const handlePostPress = (post) => {
    if (!navigation) {
      console.error('Navigation object is not available');
      return;
    }
    if (post && post.id) {
      navigation.navigate('PostDetails', { postId: post.id });
    }
  };

  if (!navigation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Erreur de navigation
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : (
        <SearchResults
          results={results}
          onUserPress={handleUserPress}
          onPostPress={handlePostPress}
          loading={loading}
          query={query}
        />
      )}
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f2ef',
  },
  text: {
    fontSize: 16,
    color: '#666',
=======
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
>>>>>>> Stashed changes
  },
});

export default SearchScreen; 