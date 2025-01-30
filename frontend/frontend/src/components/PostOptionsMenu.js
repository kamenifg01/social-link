import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PostOptionsMenu = ({ 
  isVisible, 
  onClose, 
  onDelete, 
  onEdit, 
  onReport, 
  onHide, 
  onFollow,
  isProfileOwner,
  theme 
}) => {
  console.log('PostOptionsMenu - Options:', {
    isProfileOwner,
    availableActions: isProfileOwner ? ['edit', 'delete', 'hide'] : ['connect', 'hide', 'report']
  });

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
          {isProfileOwner ? (
            // Options pour les publications sur mon profil
            <>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={onEdit}
              >
                <Icon name="pencil" size={20} color={theme.colors.text} />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={onHide}
              >
                <Icon name="eye-slash" size={20} color={theme.colors.text} />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Masquer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.deleteButton]} 
                onPress={onDelete}
              >
                <Icon name="trash" size={20} color="#ff4444" />
                <Text style={[styles.menuText, { color: "#ff4444" }]}>Supprimer</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Options pour les publications des autres
            <>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={onFollow}
              >
                <Icon name="user-plus" size={20} color={theme.colors.text} />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Se connecter</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={onHide}
              >
                <Icon name="eye-slash" size={20} color={theme.colors.text} />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>Masquer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.reportButton]} 
                onPress={onReport}
              >
                <Icon name="flag" size={20} color="#ff4444" />
                <Text style={[styles.menuText, { color: "#ff4444" }]}>Signaler</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  deleteButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  reportButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default PostOptionsMenu; 