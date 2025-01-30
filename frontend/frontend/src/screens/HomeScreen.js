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
      />
    </View>
  );
};

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
  },
});

export default HomeScreen;
