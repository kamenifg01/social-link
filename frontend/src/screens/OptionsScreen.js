import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, Modal, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

const OptionsScreen = ({ navigation, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setModalVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.optionTitle}>Options</Text>
          <View style={styles.option}>
            <Text>Mode sombre</Text>
            <Switch
              value={darkMode}
              onValueChange={(value) => setDarkMode(value)}
            />
          </View>
          <TouchableOpacity onPress={onLogout || handleLogout}>
            <Text style={styles.logout}>Déconnexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

OptionsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  onLogout: PropTypes.func,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  logout: {
    color: '#0073b1',
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    color: '#0073b1',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default OptionsScreen; 