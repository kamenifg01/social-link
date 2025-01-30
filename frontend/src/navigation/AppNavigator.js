import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../styles/theme';

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Contexte pour le thème
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Personnalisation des thèmes
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...lightTheme.colors,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...darkTheme.colors,
  },
};

const getTabBarIcon = (routeName, color, size) => {
  let iconName;

  if (routeName === 'Home') {
    iconName = 'home';
  } else if (routeName === 'Network') {
    iconName = 'users';
  } else if (routeName === 'Jobs') {
    iconName = 'briefcase';
  } else if (routeName === 'Notifications') {
    iconName = 'bell';
  } else if (routeName === 'Messages') {
    iconName = 'envelope';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const HomeTabs = () => {
  const { isDarkMode } = React.useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: '#0073b1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
          borderTopColor: isDarkMode ? '#404040' : '#e1e1e1',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Fil d\'actualité', headerShown: false }} />
      <Tab.Screen name="Network" component={NetworkScreen} options={{ title: 'Réseau', headerShown: false }} />
      <Tab.Screen name="Jobs" component={JobsScreen} options={{ title: 'Emplois', headerShown: false }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications', headerShown: false }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages', headerShown: false }} />
    </Tab.Navigator>
  );
};

const DrawerContent = ({ navigation, onLogout }) => {
  const { isDarkMode } = useContext(ThemeContext);
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

  const handleLogout = async () => {
    await onLogout();
    navigation.closeDrawer();
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
        {renderMenuItem('sign-out', 'Se déconnecter', handleLogout)}
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const systemColorScheme = useColorScheme();
  
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
    loadThemePreference();

    const tokenCheckInterval = setInterval(checkAuth, 1000);

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [checkAuth]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        const isDark = JSON.parse(savedTheme);
        setIsDarkMode(isDark);
        if (window.updateAppTheme) {
          window.updateAppTheme(isDark);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
      if (window.updateAppTheme) {
        window.updateAppTheme(newMode);
      }
    } catch (error) {
      console.error('Erreur lors du changement de thème:', error);
    }
  };

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

  const renderHeaderLeft = useCallback((navigation) => (
    <Icon
      name="user-circle"
      size={25}
      color={isDarkMode ? '#fff' : '#0073b1'}
      style={{ marginLeft: 15 }}
      onPress={() => navigation.openDrawer()}
    />
  ), [isDarkMode]);

  const renderHeaderRight = useCallback((navigation) => (
    <View style={styles.headerRight}>
      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Icon name="search" size={15} color={isDarkMode ? '#fff' : '#666'} style={styles.searchIcon} />
        <TextInput
          placeholder="Rechercher"
          placeholderTextColor={isDarkMode ? '#999' : '#666'}
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
        />
      </View>
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
      <TouchableOpacity onPress={toggleTheme}>
        <Icon 
          name={isDarkMode ? 'sun-o' : 'moon-o'} 
          size={20} 
          color={isDarkMode ? '#fff' : '#0073b1'} 
          style={{ marginRight: 15 }} 
        />
      </TouchableOpacity>
    </View>
  ), [isFiltering, isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Drawer.Navigator
        drawerContent={(props) => (
          <DrawerContent {...props} onLogout={handleLogout} />
        )}
        screenOptions={{
          headerShown: true,
          swipeEnabled: isAuthenticated && hasCompletedOnboarding,
          headerStyle: {
            backgroundColor: isDarkMode ? darkTheme.colors.background : lightTheme.colors.background,
          },
          headerTintColor: isDarkMode ? darkTheme.colors.text : lightTheme.colors.text,
        }}
      >
        {isAuthenticated ? (
          hasCompletedOnboarding ? (
            <>
              <Drawer.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={({ navigation }) => ({
                  headerTitle: '',
                  headerLeft: () => renderHeaderLeft(navigation),
                  headerRight: () => renderHeaderRight(navigation),
                })}
              />
              <Drawer.Screen name="Profile" component={ProfileScreen} />
              <Drawer.Screen name="EditProfile" 
                component={EditProfileScreen}
                options={{
                  title: 'Modifier le profil',
                  headerTitleAlign: 'center',
                }}
              />
              <Drawer.Screen name="Settings"
                component={SettingsScreen}
                options={{
                  title: 'Paramètres',
                  headerTitleAlign: 'center',
                }}
              />
              <Drawer.Screen name="PostDetails" component={PostDetailsScreen} />
              <Drawer.Screen name="CreatePost" component={CreatePostScreen} />
              <Drawer.Screen name="Messages" component={MessagesScreen} />
              <Drawer.Screen 
                name="Comments" 
                component={CommentsScreen}
                options={{
                  title: 'Commentaires',
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
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    height: 35,
    width: 200,
  },
  searchContainerDark: {
    backgroundColor: '#444',
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 5,
    color: '#333',
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
