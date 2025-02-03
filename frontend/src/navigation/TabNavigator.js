import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import NetworkScreen from '../screens/NetworkScreen';
import JobsScreen from '../screens/JobsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import { useTheme } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

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

const TabNavigator = () => {
  const { colors, dark: isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: '#0073b1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
          borderTopColor: isDarkMode ? '#404040' : '#e1e1e1',
          height: 60,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Fil d\'actualité' }} 
      />
      <Tab.Screen 
        name="Network" 
        component={NetworkScreen} 
        options={{ title: 'Réseau' }} 
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsScreen} 
        options={{ title: 'Emplois' }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notifications' }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ title: 'Messages' }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 