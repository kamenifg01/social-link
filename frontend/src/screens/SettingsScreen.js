import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAccount } from '../services/apiService';
import { useTheme } from '../hooks/useTheme';

const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erreur lors de la suppression du compte:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le compte');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderSettingItem = (icon, title, onPress, isDestructive = false, isSwitch = false, switchValue = false) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
        }
      ]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <Icon 
            name={icon} 
            size={20} 
            color={isDestructive ? theme.colors.error : theme.colors.primary} 
            style={styles.settingIcon} 
          />
          <Text style={[
            styles.settingText,
            { color: isDestructive ? theme.colors.error : theme.colors.text },
          ]}>
            {title}
          </Text>
        </View>
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onPress}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={switchValue ? theme.colors.primary : theme.colors.card}
            ios_backgroundColor={theme.colors.border}
          />
        ) : (
          <Icon 
            name="chevron-right" 
            size={16} 
            color={isDestructive ? theme.colors.error : theme.colors.textSecondary} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Apparence
        </Text>
        {renderSettingItem('adjust', 'Mode sombre', toggleTheme, false, true, isDarkMode)}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Compte
        </Text>
        {renderSettingItem('lock', 'Confidentialité', () => {})}
        {renderSettingItem('bell', 'Notifications', () => {})}
        {renderSettingItem('language', 'Langue', () => {})}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Aide
        </Text>
        {renderSettingItem('question-circle', 'Centre d\'aide', () => {})}
        {renderSettingItem('info-circle', 'À propos', () => {})}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Danger
        </Text>
        {renderSettingItem('trash', 'Supprimer le compte', handleDeleteAccount, true)}
      </View>

      <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingItem: {
    borderRadius: 12,
    marginBottom: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 24,
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
    marginBottom: 16,
  },
});

export default SettingsScreen; 