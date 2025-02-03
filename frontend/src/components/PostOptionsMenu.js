import React from 'react';
<<<<<<< Updated upstream
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
=======
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
>>>>>>> Stashed changes

const PostOptionsMenu = ({ 
  isVisible, 
  onClose, 
  onDelete, 
  onEdit, 
  onReport, 
<<<<<<< Updated upstream
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
=======
  onHide,
  onFollow,
  onShare,
  onCopyLink,
  isProfileOwner,
  isFollowing,
  theme,
  hasMedia
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menuContainer, { backgroundColor: theme.card }]}>
          {isProfileOwner ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
                <Icon name="edit" size={20} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Modifier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
                <Icon name="trash" size={20} color={theme.error} />
                <Text style={[styles.menuText, { color: theme.error }]}>Supprimer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={onFollow}>
                <Icon name={isFollowing ? "user-times" : "user-plus"} size={20} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>
                  {isFollowing ? "Ne plus suivre" : "Suivre"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onReport}>
                <Icon name="flag" size={20} color={theme.text} />
                <Text style={[styles.menuText, { color: theme.text }]}>Signaler</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={onShare}>
            <Icon name="share" size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Partager</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onCopyLink}>
            <Icon name="share-alt" size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Partager le lien</Text>
          </TouchableOpacity>

          {hasMedia && (
            <TouchableOpacity style={styles.menuItem} onPress={onHide}>
              <Icon name="eye-slash" size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Masquer</Text>
            </TouchableOpacity>
          )}
>>>>>>> Stashed changes
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

<<<<<<< Updated upstream
const styles = StyleSheet.create({
  overlay: {
=======
PostOptionsMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onReport: PropTypes.func,
  onHide: PropTypes.func,
  onFollow: PropTypes.func,
  onShare: PropTypes.func,
  onCopyLink: PropTypes.func,
  isProfileOwner: PropTypes.bool,
  isFollowing: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  hasMedia: PropTypes.bool
};

const styles = StyleSheet.create({
  modalOverlay: {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
>>>>>>> Stashed changes
  },
});

export default PostOptionsMenu; 