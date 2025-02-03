<<<<<<< Updated upstream
import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import PostCard from "../components/PostCard";
import { fetchPosts } from '../services/apiService';
import { globalStyles } from "../styles/globalStyles";
import PropTypes from 'prop-types';
import { ThemeContext } from '../navigation/AppNavigator';
import { useTheme } from '../hooks/useTheme';
import { createGlobalStyles } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };
    loadPosts();
  }, []);

  const navigateToPostDetails = (post) => {
    navigation.navigate('PostDetails', { post });
  };

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y > 0) {
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
  };

  const handleProfilePress = (post) => {
    navigation.navigate('Profile', { userId: post.authorId });
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      {showWelcome && (
        <Text style={[styles.welcome, { color: isDarkMode ? '#e1e1e1' : '#666' }]}>
          Bienvenue sur notre application de réseau social !
        </Text>
      )}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToPostDetails(item)}>
            <PostCard 
              post={item} 
              navigation={navigation} 
              onProfilePress={() => handleProfilePress(item)}
              isProfileOwner={false}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}
=======
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import PostCard from "../components/PostCard";
import { fetchPosts } from '../services/apiService';
import { useTheme } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const loadPosts = async () => {
    try {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleProfilePress = (user) => {
    navigation.navigate('Profile', { userId: user.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            navigation={navigation} 
            onProfilePress={handleProfilePress}
            isProfileOwner={false}
            onUpdate={handleRefresh}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Aucune publication pour le moment
            </Text>
          </View>
        }
>>>>>>> Stashed changes
      />
    </View>
  );
};

<<<<<<< Updated upstream
HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  container: {
    // Styles spécifiques à HomeScreen
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
>>>>>>> Stashed changes
  },
});

export default HomeScreen;
