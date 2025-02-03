import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCREENS } from '../navigation/types';

const CustomDrawerContent = ({ navigation }) => {
  const { colors } = useTheme();
  const { logout, user } = useAuth();
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    loadProfileViews();
  }, []);

  const loadProfileViews = async () => {
    try {
      const views = await AsyncStorage.getItem('profileViews');
      setProfileViews(views ? parseInt(views) : Math.floor(Math.random() * 100));
    } catch (error) {
      console.error('Erreur chargement vues profil:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.closeDrawer();
  };

  const renderMenuItem = (icon, text, onPress) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: colors.card }]} 
      onPress={onPress}
    >
      <Icon name={icon} size={20} color={colors.primary} style={styles.menuIcon} />
      <Text style={[styles.menuText, { color: colors.text }]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.profileHeader}
          onPress={() => navigation.navigate(SCREENS.PROFILE)}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Icon name="user-circle" size={50} color={colors.primary} />
          )}
          <Text style={[styles.profileName, { color: colors.text }]}>
            {user?.username || 'Utilisateur'}
          </Text>
          <Text style={[styles.profileViews, { color: colors.text }]}>
            {profileViews} vues du profil
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {renderMenuItem('eye', 'Qui a consulté votre profil', () => 
          navigation.navigate(SCREENS.PROFILE)
        )}
        {renderMenuItem('bookmark', 'Posts enregistrés', () => {})}
        {renderMenuItem('users', 'Connexions', () => {})}
        {renderMenuItem('bell', 'Notifications', () => 
          navigation.navigate(SCREENS.NOTIFICATIONS)
        )}
        {renderMenuItem('envelope', 'Messages', () => 
          navigation.navigate(SCREENS.MESSAGES)
        )}
        {renderMenuItem('cog', 'Paramètres', () => 
          navigation.navigate(SCREENS.SETTINGS)
        )}
        {renderMenuItem('sign-out', 'Se déconnecter', handleLogout)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  profileViews: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  menuIcon: {
    width: 25,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomDrawerContent; 