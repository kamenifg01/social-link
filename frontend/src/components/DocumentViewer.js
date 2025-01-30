import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

const DocumentViewer = ({ documents }) => {
  return (
    <View style={styles.container}>
      {documents.map((doc, index) => (
        doc.type === 'image' ? (
          <Image key={index} source={{ uri: doc.uri }} style={styles.image} />
        ) : doc.type === 'pdf' ? (
          <Pdf
            key={index}
            source={{ uri: doc.uri }}
            style={styles.pdf}
          />
        ) : doc.type === 'video' ? (
          <Video
            key={index}
            source={{ uri: doc.uri }}
            style={styles.video}
            controls
          />
        ) : null
      ))}
    </View>
  );
};

DocumentViewer.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['image', 'pdf', 'video']).isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200,
    marginBottom: 10,
  },
  pdf: {
    width: Dimensions.get('window').width,
    height: 400,
    marginBottom: 10,
  },
  video: {
    width: Dimensions.get('window').width,
    height: 200,
    marginBottom: 10,
  },
});

export default DocumentViewer; 