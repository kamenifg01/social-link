import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
<<<<<<< Updated upstream
import { useTheme } from '../hooks/useTheme';

const JobsScreen = ({ navigation }) => {
  const { theme } = useTheme();
=======
import { useTheme } from '../contexts/ThemeContext';

const JobsScreen = ({ navigation }) => {
  const { colors } = useTheme();
>>>>>>> Stashed changes

  const jobs = [
    {
      id: '1',
      title: 'Développeur Full Stack',
      company: 'Tech Solutions',
      location: 'Paris, France',
      type: 'CDI',
      salary: '45k-60k',
      posted: 'Il y a 2 jours',
    },
    {
      id: '2',
      title: 'UX Designer Senior',
      company: 'Design Studio',
      location: 'Lyon, France',
      type: 'CDI',
      salary: '40k-55k',
      posted: 'Il y a 3 jours',
    },
    // Ajoutez d'autres offres d'emploi ici
  ];

  const renderJob = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.jobCard,
        { 
<<<<<<< Updated upstream
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
=======
          backgroundColor: colors.card,
          borderColor: colors.border
>>>>>>> Stashed changes
        }
      ]}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.jobHeader}>
<<<<<<< Updated upstream
        <Text style={[styles.jobTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Icon name="bookmark-o" size={20} color={theme.colors.primary} />
      </View>

      <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>
=======
        <Text style={[styles.jobTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Icon name="bookmark-o" size={20} color={colors.primary} />
      </View>

      <Text style={[styles.companyName, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
        {item.company}
      </Text>

      <View style={styles.jobInfo}>
        <View style={styles.infoItem}>
<<<<<<< Updated upstream
          <Icon name="map-marker" size={14} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
=======
          <Icon name="map-marker" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
            {item.location}
          </Text>
        </View>

        <View style={styles.infoItem}>
<<<<<<< Updated upstream
          <Icon name="briefcase" size={14} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
=======
          <Icon name="briefcase" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
            {item.type}
          </Text>
        </View>

        <View style={styles.infoItem}>
<<<<<<< Updated upstream
          <Icon name="money" size={14} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
=======
          <Icon name="money" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
            {item.salary}
          </Text>
        </View>
      </View>

<<<<<<< Updated upstream
      <Text style={[styles.postedTime, { color: theme.colors.textSecondary }]}>
=======
      <Text style={[styles.postedTime, { color: colors.textSecondary }]}>
>>>>>>> Stashed changes
        {item.posted}
      </Text>
    </TouchableOpacity>
  );

  return (
<<<<<<< Updated upstream
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.inputBackground }]}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            placeholder="Rechercher des emplois..."
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.searchInput, { color: theme.colors.text }]}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}>
          <Icon name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

=======
    <View style={[styles.container, { backgroundColor: colors.background }]}>
>>>>>>> Stashed changes
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
<<<<<<< Updated upstream
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
=======
>>>>>>> Stashed changes
  listContainer: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 12,
  },
  jobInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
  },
  postedTime: {
    fontSize: 12,
  },
});

export default JobsScreen; 