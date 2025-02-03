import React, { useState, useEffect, useCallback } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import PropTypes from 'prop-types';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NetworkScreen from '../screens/NetworkScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import JobsScreen from '../screens/JobsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CommentsScreen from '../screens/CommentsScreen';
import HomeTabs from './TabNavigator';
import SearchScreen from '../screens/SearchScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerContent = ({ navigation, onLogout }) => {
  const { colors, isDarkMode } = useTheme();
  const [userName, setUserName] = useState('');
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const profile = await AsyncStorage.getItem('profile');
      if (profile) {
        const { username } = JSON.parse(profile);
        setUserName(username);
      }
      setProfileViews(Math.floor(Math.random() * 100));
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  const handleProfileNavigation = () => {
    navigation.closeDrawer();
    navigation.navigate('Profile');
  };

  const handleSettingsNavigation = () => {
    navigation.closeDrawer();
    navigation.navigate('Settings');
  };

  const renderMenuItem = (icon, text, onPress) => (
    <TouchableOpacity 
      style={[styles.menuItem, isDarkMode && styles.menuItemDark]} 
      onPress={onPress}
    >
      <Icon name={icon} size={20} color="#0073b1" style={styles.menuIcon} />
      <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.drawerContent, isDarkMode && styles.drawerContentDark]}>
      <View style={[styles.profileSection, isDarkMode && styles.profileSectionDark]}>
        <Icon name="user-circle" size={50} color="#0073b1" />
        <Text style={[styles.profileName, isDarkMode && styles.profileNameDark]}>
          {userName || 'Utilisateur'}
        </Text>
        <TouchableOpacity 
          style={styles.profileLinkContainer}
          onPress={handleProfileNavigation}
        >
          <Text style={styles.profileLink}>Voir le profil</Text>
        </TouchableOpacity>
        <Text style={[styles.profileViews, isDarkMode && styles.profileViewsDark]}>
          {profileViews} vues du profil
        </Text>
      </View>

      <View style={styles.menuContainer}>
        {renderMenuItem('eye', 'Qui a consulté votre profil', handleProfileNavigation)}
        {renderMenuItem('gamepad', 'Jeux', () => {})}
        {renderMenuItem('bookmark', 'Posts enregistrés', () => {})}
        {renderMenuItem('file', 'Pages', () => {})}
        {renderMenuItem('cog', 'Paramètres', handleSettingsNavigation)}
        {renderMenuItem('sign-out', 'Se déconnecter', onLogout)}
      </View>
    </View>
  );
};

DrawerContent.propTypes = {
  navigation: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDarkMode } = useTheme();
  
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated);
  }, [auth.isAuthenticated]);

  const checkAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
      setIsAuthenticated(!!token);
      setHasCompletedOnboarding(!!onboardingCompleted);
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const tokenCheckInterval = setInterval(checkAuth, 1000);
    return () => clearInterval(tokenCheckInterval);
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, []);

  const handleFilter = () => {
    setIsFiltering(!isFiltering);
    console.log('Filtrage:', !isFiltering);
  };

  const handleSearch = (text, navigation) => {
    setSearchQuery(text);
    if (text.trim() && navigation) {
      navigation.navigate('Search', { query: text.trim() });
    }
  };

  const renderHeaderLeft = useCallback(({ navigation }) => (
    <Icon
      name="user-circle"
      size={25}
      color={isDarkMode ? '#fff' : '#0073b1'}
      style={{ marginLeft: 15 }}
      onPress={() => navigation.openDrawer()}
    />
  ), [isDarkMode]);

  const renderHeaderRight = useCallback(({ navigation }) => {
    // Vérifier si nous sommes dans l'onglet Home
    const tabState = navigation.getState()?.routes?.[0]?.state;
    const currentTab = tabState?.routes?.[tabState?.index]?.name;
    const isHomeTab = !tabState || currentTab === 'Home';

    return (
      <View style={styles.headerRight}>
        <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
          <Icon name="search" size={15} color={isDarkMode ? '#fff' : '#666'} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
            value={searchQuery}
            onChangeText={(text) => handleSearch(text, navigation)}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                navigation.navigate('Search', { query: searchQuery.trim() });
              }
            }}
          />
        </View>
        {currentTab === 'Jobs' && (
          <TouchableOpacity onPress={handleFilter} style={{ marginLeft: 10 }}>
            <Icon 
              name="sliders" 
              size={20} 
              color={isFiltering ? '#0073b1' : (isDarkMode ? '#fff' : '#0073b1')}
            />
          </TouchableOpacity>
        )}
        {isHomeTab && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
              <Icon name="edit" size={20} color={isDarkMode ? '#fff' : '#0073b1'} style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFilter}>
              <Icon 
                name="filter" 
                size={20} 
                color={isFiltering ? '#0073b1' : (isDarkMode ? '#fff' : '#0073b1')} 
                style={{ marginRight: 15 }} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ScanQR')}>
              <Icon 
                name="qrcode" 
                size={20} 
                color={isDarkMode ? '#fff' : '#0073b1'} 
                style={{ marginRight: 15 }} 
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }, [isFiltering, isDarkMode, searchQuery]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContent {...props} onLogout={handleLogout} />
      )}
      screenOptions={({ navigation, route }) => {
        // Vérifier si nous sommes dans l'onglet Home du TabNavigator
        const tabState = route.state?.routes?.[0]?.state;
        const currentTab = tabState?.routes?.[tabState?.index]?.name;
        const isHomeTab = route.name === 'HomeTabs' && (!tabState || currentTab === 'Home');

        return {
          headerShown: true,
          swipeEnabled: isAuthenticated && hasCompletedOnboarding,
          headerStyle: {
            backgroundColor: isDarkMode ? colors.background : colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: isDarkMode ? colors.text : colors.text,
          drawerStyle: {
            backgroundColor: isDarkMode ? colors.card : colors.card,
          },
          headerLeft: isHomeTab ? 
            () => renderHeaderLeft({ navigation }) : 
            () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                <Icon name="arrow-left" size={24} color={isDarkMode ? '#fff' : '#0073b1'} />
              </TouchableOpacity>
            ),
          headerRight: isHomeTab ? () => renderHeaderRight({ navigation }) : undefined,
        };
      }}
    >
      {isAuthenticated ? (
        hasCompletedOnboarding ? (
          <>
            <Drawer.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{
                headerTitle: '',
              }}
            />
            <Drawer.Screen 
              name="Profile"
              component={ProfileScreen}
              options={{
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Settings"
              component={SettingsScreen}
              options={{
                headerTitle: 'Paramètres',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Comments"
              component={CommentsScreen}
              options={{
                headerTitle: 'Commentaires',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Search"
              component={SearchScreen}
              options={{
                headerTitle: 'Recherche',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="CreatePost"
              component={CreatePostScreen}
              options={{
                headerTitle: 'Créer un post',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="PostDetails"
              component={PostDetailsScreen}
              options={{
                headerTitle: 'Détails du post',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerTitle: 'Modifier le profil',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Messages"
              component={MessagesScreen}
              options={{
                headerTitle: 'Messages',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Network"
              component={NetworkScreen}
              options={{
                headerTitle: 'Réseau',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerTitle: 'Notifications',
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen 
              name="Jobs"
              component={JobsScreen}
              options={{
                headerTitle: 'Emplois',
                headerTitleAlign: 'center',
              }}
            />
          </>
        ) : (
          <Drawer.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{
              headerShown: false,
              swipeEnabled: false
            }}
          />
        )
      ) : (
        <>
          <Drawer.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false,
              swipeEnabled: false
            }}
          />
          <Drawer.Screen 
            name="SignUp" 
            component={SignUpScreen}
            options={{
              headerShown: false,
              swipeEnabled: false
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 36,
    flex: 1,
    marginRight: 10,
  },
  searchContainerDark: {
    backgroundColor: '#404040',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    height: '100%',
    padding: 0,
  },
  searchInputDark: {
    color: '#fff',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  drawerContentDark: {
    backgroundColor: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileSectionDark: {
    borderBottomColor: '#444',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  profileNameDark: {
    color: '#fff',
  },
  profileLinkContainer: {
    marginTop: 8,
    padding: 8,
  },
  profileLink: {
    color: '#0073b1',
    fontSize: 16,
    fontWeight: '500',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemDark: {
    backgroundColor: '#444',
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuTextDark: {
    color: '#fff',
  },
  profileViews: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  profileViewsDark: {
    color: '#999',
  },
});

export default AppNavigator;
